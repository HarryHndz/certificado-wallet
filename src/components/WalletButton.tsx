"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";

/**
 * Envuelve WalletMultiButton para evitar hydration mismatch:
 * solo se renderiza en el cliente después del mount.
 */
export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="wallet-adapter-button wallet-adapter-button-trigger h-10 min-w-[152px] animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <WalletMultiButton />
      {connected && publicKey && (
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
        </p>
      )}
    </div>
  );
}
