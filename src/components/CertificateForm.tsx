"use client";

import { useState } from "react";
import Link from "next/link";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "@/components/WalletButton";
import { CelebrationScreen } from "@/components/CelebrationScreen";
import { mintCertificateNFT } from "@/lib/mintCertificate";

export function CertificateForm() {
  const { connection } = useConnection();
  const { wallet, connected } = useWallet();
  const [nombre, setNombre] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ nombre: string; proyecto: string; mintAddress: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!connected || !wallet?.adapter) {
      setError("Conecta tu wallet primero.");
      return;
    }
    const n = nombre.trim();
    const p = proyecto.trim();
    if (!n || !p) {
      setError("Completa nombre y proyecto.");
      return;
    }

    setLoading(true);
    try {
      const fecha = new Date().toISOString().split("T")[0];
      const base =
        (typeof window !== "undefined" &&
          (process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
            window.location.origin)) ||
        "";
      const params = new URLSearchParams({
        n: n,
        p: p,
        d: fecha,
      });
      const metadataUri = `${base}/api/metadata?${params.toString()}`;

      const rpcEndpoint = connection.rpcEndpoint;
      const adapter = wallet.adapter as Parameters<typeof mintCertificateNFT>[0]["walletAdapter"];
      const { mintAddress } = await mintCertificateNFT({
        nombre: n,
        proyecto: p,
        metadataUri,
        walletAdapter: adapter,
        rpcEndpoint,
      });

      setSuccess({ nombre: n, proyecto: p, mintAddress });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear el certificado.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <CelebrationScreen
        nombre={success.nombre}
        proyecto={success.proyecto}
        mintAddress={success.mintAddress}
        onClose={() => setSuccess(null)}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 p-6 dark:bg-black">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
          Generar certificado NFT
        </h1>
        <p className="mb-4 text-zinc-600 dark:text-zinc-400">
          Completa los datos y recibirás un certificado en tu wallet.
        </p>
        <p className="mb-6">
          <Link
            href="/ver"
            className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Ver un certificado por dirección (mint) →
          </Link>
        </p>

        {!connected ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">
              Conecta tu wallet para continuar.
            </p>
            <WalletButton />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
            <div>
              <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="proyecto" className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nombre del proyecto
              </label>
              <input
                id="proyecto"
                type="text"
                value={proyecto}
                onChange={(e) => setProyecto(e.target.value)}
                placeholder="Nombre del proyecto"
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                disabled={loading}
              />
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? "Generando certificado…" : "Generar certificado NFT"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
