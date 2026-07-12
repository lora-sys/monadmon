import { defineChain } from "viem";

// Monad testnet — chain ID 10143 (0x279f), verified 2026-07-11.
// RPC: https://testnet-rpc.monad.xyz (also https://monad-testnet.drpc.org).
export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "Monad Explorer", url: "https://testnet.monadscan.com" },
  },
  testnet: true,
});
