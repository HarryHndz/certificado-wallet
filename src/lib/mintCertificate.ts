"use client";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import type { WalletAdapter } from "@metaplex-foundation/umi-signer-wallet-adapters";

const CERT_SYMBOL = "CERT";
/** Límite del programa Metaplex Token Metadata para el campo name (32 bytes) */
const METADATA_NAME_MAX_LEN = 32;

export type MintCertificateParams = {
  nombre: string;
  proyecto: string;
  metadataUri: string;
  walletAdapter: WalletAdapter;
  rpcEndpoint: string;
};

export async function mintCertificateNFT(params: MintCertificateParams): Promise<{ mintAddress: string }> {
  const { proyecto, metadataUri, walletAdapter, rpcEndpoint } = params;

  const umi = createUmi(rpcEndpoint)
    .use(mplTokenMetadata())
    .use(walletAdapterIdentity(walletAdapter));

  const mint = generateSigner(umi);
  const fullName = `Certificado - ${proyecto}`;
  const name = fullName.length > METADATA_NAME_MAX_LEN ? fullName.slice(0, METADATA_NAME_MAX_LEN) : fullName;

  const builder = createNft(umi, {
    mint,
    name,
    symbol: CERT_SYMBOL,
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(0),
  });

  await builder.sendAndConfirm(umi);

  const mintAddress = typeof mint.publicKey === "string" ? mint.publicKey : (mint.publicKey as { toBase58?: () => string }).toBase58?.() ?? String(mint.publicKey);
  return { mintAddress };
}
