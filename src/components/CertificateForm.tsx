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
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Generar certificado NFT
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Completa los datos y recibirás un certificado en tu wallet.
          </p>
        </div>
        <p className="mb-6 text-center">
          <Link
            href="/ver"
            className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            Ver un certificado por dirección (mint) →
          </Link>
        </p>
        
        {!connected ? (
          <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-8 shadow-xl dark:border-gray-700 dark:bg-gray-900/80">
            <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
              Conecta tu wallet para continuar.
            </p>
            <div className="flex justify-center">
              <WalletButton />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-8 shadow-xl dark:border-gray-700 dark:bg-gray-900/80">
            <div>
              <label htmlFor="nombre" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="proyecto" className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Nombre del proyecto
              </label>
              <input
                id="proyecto"
                type="text"
                value={proyecto}
                onChange={(e) => setProyecto(e.target.value)}
                placeholder="Nombre del proyecto"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                disabled={loading}
              />
            </div>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 dark:bg-red-900/30 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white transition-all hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando certificado…
                </div>
              ) : (
                "Generar certificado NFT"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
