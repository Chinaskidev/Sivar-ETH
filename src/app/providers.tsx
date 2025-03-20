"use client";
import React from "react";
import {  WagmiProvider } from "wagmi";
import { RainbowKitProvider, getDefaultConfig, } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "wagmi/chains";
import { http } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const chains = [baseSepolia] as const;


const projectId = "bd6f9cb329ee9d45a2494ef05a017254"; 

// La nueva API de Wagmi que simplifica la configuración (reemplaza getDefaultWallets y connectorsForWallets)
const config = getDefaultConfig({
  appName: "Volcanoes",
  projectId,
  chains,
  transports: {
    [baseSepolia.id]: http(),
    
  },
});

// Instancia de TanStack Query
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {/* RainbowKitProvider ya no requiere la prop chains */}
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
  
  );
}
