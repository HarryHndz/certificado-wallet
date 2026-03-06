"use client";

import { useState } from "react";
import Link from "next/link";
import { fetchCertificateByMint, type CertificateView } from "@/lib/fetchCertificateByMint";

const RPC =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? "https://api.devnet.solana.com";

export default function VerCertificadoPage() {
  const [mintInput, setMintInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cert, setCert] = useState<CertificateView | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mint = mintInput.trim();
    if (!mint) {
      setError("Escribe la dirección del certificado (mint).");
      return;
    }
    setError(null);
    setCert(null);
    setLoading(true);
    try {
      const result = await fetchCertificateByMint(mint, RPC);
      if (result.cert) setCert(result.cert);
      else setError(result.error ?? "No se encontró un certificado con esa dirección.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar el certificado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 dark:bg-black">
      <div className="mx-auto max-w-lg">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Volver a generar certificado
        </Link>
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
          Ver certificado NFT
        </h1>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Pega la dirección del mint del certificado para ver la imagen y los
          datos.
        </p>

        <form onSubmit={handleSubmit} className="mb-8">
          <input
            type="text"
            value={mintInput}
            onChange={(e) => setMintInput(e.target.value)}
            placeholder="Ej: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
            className="mb-3 w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 font-mono text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? "Buscando…" : "Ver certificado"}
          </button>
          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </p>
          )}
        </form>

        {cert && (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
              {cert.name}
            </h2>
            {cert.image && (
              <div className="mb-4 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={cert.image}
                  alt={cert.name}
                  className="w-full object-cover"
                />
              </div>
            )}
            {cert.description && (
              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                {cert.description}
              </p>
            )}
            <dl className="space-y-2">
              {cert.attributes.map((a) => (
                <div key={a.trait_type} className="flex gap-2 text-sm">
                  <dt className="font-medium text-zinc-500 dark:text-zinc-400">
                    {a.trait_type}:
                  </dt>
                  <dd className="text-zinc-900 dark:text-white">{a.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 break-all font-mono text-xs text-zinc-500 dark:text-zinc-400">
              Mint: {cert.mint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
