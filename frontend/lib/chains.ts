import { defineChain } from "viem";

const configuredRpcUrl = process.env.NEXT_PUBLIC_MONAD_RPC_URL;
const isLocal =
  configuredRpcUrl?.includes("127.0.0.1") ||
  configuredRpcUrl?.includes("localhost");
const testnetRpcUrl =
  !isLocal && configuredRpcUrl
    ? configuredRpcUrl
    : "https://testnet-rpc.monad.xyz";
const localRpcUrl =
  isLocal && configuredRpcUrl ? configuredRpcUrl : "http://127.0.0.1:8545";

// Monad testnet — chain ID 10143 (0x279f), verified 2026-07-11.
// RPC: https://testnet-rpc.monad.xyz (also https://monad-testnet.drpc.org).
export const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "Monad", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: [testnetRpcUrl] },
  },
  blockExplorers: {
    default: { name: "Monad Explorer", url: "https://testnet.monadscan.com" },
  },
  testnet: true,
});

// Local anvil — chain ID 31337. Used for E2E + local dev against deployed contracts.
export const anvil = defineChain({
  id: 31337,
  name: "Anvil",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [localRpcUrl] },
  },
  blockExplorers: {
    default: { name: "(local)", url: "http://127.0.0.1:8545" },
  },
  testnet: true,
});

export const activeChain = isLocal ? anvil : monadTestnet;
