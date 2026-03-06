"use client";

import { Connection, PublicKey } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey as umiPublicKey } from "@metaplex-foundation/umi";
import { fetchDigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

export type CertificateView = {
  name: string;
  image: string;
  description?: string;
  attributes: Array<{ trait_type: string; value: string }>;
  mint: string;
};

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

async function fetchUriFromMetadataAccount(
  connection: Connection,
  mintAddress: string
): Promise<string | null> {
  try {
    const mint = new PublicKey(mintAddress);
    const [metadataPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    );
    const accountInfo = await connection.getAccountInfo(metadataPda);
    if (!accountInfo?.data) return null;
    const data = Buffer.from(accountInfo.data);
    if (data.length < 69) return null;
    let pos = 65;
    const nameLen = data.readUInt32LE(pos);
    pos += 4 + nameLen;
    const symbolLen = data.readUInt32LE(pos);
    pos += 4 + symbolLen;
    const uriLen = data.readUInt32LE(pos);
    pos += 4;
    const uri = data.subarray(pos, pos + uriLen).toString("utf8");
    return uri;
  } catch {
    return null;
  }
}

export async function fetchCertificateByMint(
  mintAddress: string,
  rpcEndpoint: string
): Promise<{ cert: CertificateView | null; error?: string }> {
  const trimmed = mintAddress.trim();
  if (!trimmed) return { cert: null, error: "Dirección vacía" };

  let uri: string | null = null;
  let nameOnChain = "";

  try {
    const umi = createUmi(rpcEndpoint).use(mplTokenMetadata());
    const mint = umiPublicKey(trimmed);
    const asset = await fetchDigitalAsset(umi, mint);
    uri =
      typeof asset.metadata.uri === "string"
        ? asset.metadata.uri
        : String(asset.metadata.uri);
    nameOnChain = typeof asset.metadata.name === "string" ? asset.metadata.name : String(asset.metadata.name ?? "");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    try {
      const connection = new Connection(rpcEndpoint);
      uri = await fetchUriFromMetadataAccount(connection, trimmed);
    } catch {
      return { cert: null, error: `No se encontró metadata (${msg})` };
    }
    if (!uri) return { cert: null, error: "No se encontró la cuenta de metadata para este mint." };
  }

  if (!uri) return { cert: null, error: "URI de metadata no disponible." };

  try {
    const res = await fetch(uri);
    if (!res.ok) return { cert: null, error: `No se pudo cargar la metadata (${res.status})` };
    const json = (await res.json()) as {
      name?: string;
      description?: string;
      image?: string;
      attributes?: Array<{ trait_type?: string; value?: string }>;
    };

    const attributes = (json.attributes ?? []).map((a) => ({
      trait_type: a.trait_type ?? "",
      value: String(a.value ?? ""),
    }));

    return {
      cert: {
        name: json.name ?? nameOnChain ?? "Certificado",
        image: json.image ?? "",
        description: json.description,
        attributes,
        mint: trimmed,
      },
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { cert: null, error: `Error al cargar JSON de metadata (${msg})` };
  }
}
