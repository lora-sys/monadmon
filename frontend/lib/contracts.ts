// Deployed contract addresses (Monad testnet).
// Override via NEXT_PUBLIC_MONADMON_* env vars when deploying to a different network.
export const MONSTER_NFT_ADDRESS =
  (process.env.NEXT_PUBLIC_MONSTER_NFT_ADDRESS as `0x${string}`) ??
  "0x0000000000000000000000000000000000000000";
export const GENESIS_MINTER_ADDRESS =
  (process.env.NEXT_PUBLIC_GENESIS_MINTER_ADDRESS as `0x${string}`) ??
  "0x0000000000000000000000000000000000000000";
export const BATTLE_ADDRESS =
  (process.env.NEXT_PUBLIC_BATTLE_ADDRESS as `0x${string}`) ??
  "0x0000000000000000000000000000000000000000";
