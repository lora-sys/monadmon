# Monad Network

Monad-specific facts the team needs. Pinned at start of Phase 1.

## Network
- Chain: Monad (EVM-compatible L1).
- Testnet RPC: `https://testnet-rpc.monad.xyz` (verified 2026-07-11, returns `eth_chainId = 0x279f`, `eth_blockNumber`, `eth_gasPrice`, `web3_clientVersion`).
- Backup RPC: `https://monad-testnet.drpc.org` (same chain ID, secondary endpoint).
- Client: `Monad/0.15.0`.
- Block time target: ~400 ms (single-slot finality).
- EVM: full bytecode compatibility; behaves like Ethereum post-merge.

## Chain ID
- **Chain ID: 10143 (0x279f).** Testnet only.
- Faucet: try the official faucet at `https://faucet.monad.xyz` or `https://docs.monad.xyz` (re-verify at deploy time; URLs change between testnet phases).

## Gas & fees
- Gas units priced in **wei**, paid in **MON** (native token).
- Observed gas price on 2026-07-11: ~101 gwei (`0x17bfac7c00`).
- MVP deploys from a faucet-funded test wallet.
- Each action logs gas used in its Evidence pack.

## Wallet for deploy
- A throwaway deployer EOA is generated locally; private key lives in `.env` (gitignored).
- Address and balance recorded in `docs/evidence/<deploy-id>/deployer.json` after first deploy.

## Tooling compatibility
- All standard EVM tooling works: Hardhat, Foundry (Forge/Anvil/Cast), viem, ethers.
- Chainlink VRF: **not deployed on Monad testnet as of 2026-Q1.** We use `block.prevrandao` directly (ADR-0004).
- The Graph: hosted service not officially on Monad; we use a simple indexer instead (Phase 2).

## Wallets
- MetaMask works (custom RPC).
- Rabby works.
- WalletConnect-compatible wallets via Reown AppKit / RainbowKit.

## Block explorers
- Testnet explorer candidates (2026-07-11): `monadscan.com` (returns 200), `monadvision.com` (returns 403 to bots, may work in browser).
- Final explorer URL pinned at deploy time.

## Faucet
- Try `https://faucet.monad.xyz` (verify at deploy time).

## Re-verification log
- 2026-07-11: chain ID 0x279f confirmed; RPC live; gas price ~101 gwei.
