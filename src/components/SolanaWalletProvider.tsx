"use client";

import { useCallback, useMemo } from "react";
import type { WalletError } from "@solana/wallet-adapter-base";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

const network = WalletAdapterNetwork.Devnet;

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? clusterApiUrl(network),
    []
  );

  console.log("endpoint", endpoint);
  console.log("network", network);
  console.log("process.env.NEXT_PUBLIC_SOLANA_RPC_URL", process.env.NEXT_PUBLIC_SOLANA_RPC_URL);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  const onError = useCallback((error: WalletError) => {
    console.error("Wallet error:", error.message);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
