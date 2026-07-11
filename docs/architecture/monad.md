# Monad Network

Monad-specific facts the team needs. Update at start of Phase 1.

## Network
- Chain: Monad (EVM-compatible L1).
- Testnet RPC: `https://testnet-rpc.monad.xyz` (verify at start of Phase 1; multiple public RPCs exist).
- Block time: ~400 ms.
- Finality: single-slot.
- EVM: full bytecode compatibility; behaves like Ethereum post-merge.

## Chain ID
- **TODO at Phase 1 start:** pin the testnet chain ID from `https://chainlist.org/chain/monad` or `https://docs.monad.xyz`. Add here and to `wagmi` config.

## Gas & fees
- Gas units priced in **wei**, paid in **MON** (native token).
- MVP deploys from a faucet-funded test wallet. No mainnet.
- Each action should log gas used in the Evidence pack.

## Tooling compatibility
- All standard EVM tooling works: Hardhat, Foundry (Forge/Anvil/Cast), viem, ethers.
- Chainlink VRF: **not deployed on Monad testnet as of 2026-Q1.** We use commit-reveal (see ADR-0004).
- The Graph: hosted service not officially on Monad; we use a simple indexer instead.

## Wallets
- MetaMask works (custom RPC).
- Rabby works.
- WalletConnect-compatible wallets via Reown AppKit / RainbowKit.

## Block explorers
- Testnet explorer URL TBD at Phase 1 start. Record here.

## Faucet
- Testnet faucet URL TBD at Phase 1 start. Record here.
