"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

type CelebrationScreenProps = {
  nombre: string;
  proyecto: string;
  mintAddress: string;
  onClose?: () => void;
};

export function CelebrationScreen({ nombre, proyecto, mintAddress, onClose }: CelebrationScreenProps) {
  const run = useRef(false);

  useEffect(() => {
    if (run.current) return;
    run.current = true;

    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#6366f1", "#8b5cf6", "#a855f7", "#c084fc", "#e879f9"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#6366f1", "#8b5cf6", "#a855f7", "#c084fc", "#e879f9"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    const t = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#8b5cf6", "#22c55e", "#eab308"],
      });
    }, 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linear-to-b from-zinc-50 to-zinc-100 p-6 dark:from-zinc-900 dark:to-zinc-950">
      <div className="max-w-md rounded-2xl border border-zinc-200/80 bg-white/90 p-8 shadow-xl dark:border-zinc-700/80 dark:bg-zinc-900/90">
        <div className="mb-6 text-center">
          <span className="text-6xl" role="img" aria-label="celebración">
            🎉
          </span>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
          ¡Certificado generado!
        </h1>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Tu certificado NFT está en tu wallet.
        </p>
        <div className="space-y-2 rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Nombre</p>
          <p className="text-zinc-900 dark:text-white">{nombre}</p>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Proyecto</p>
          <p className="text-zinc-900 dark:text-white">{proyecto}</p>
          <p className="mt-2 break-all text-xs text-zinc-500 dark:text-zinc-400">
            Mint: {mintAddress}
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
          ¿La imagen se ve en negro en Phantom? Despliega la app y configura{" "}
          <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-700">NEXT_PUBLIC_APP_URL</code> con tu URL pública.
        </p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-500"
          >
            Crear otro certificado
          </button>
        )}
      </div>
    </div>
  );
}
