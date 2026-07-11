# Deploy

## Environments
- **local:** Anvil (Foundry) on `127.0.0.1:8545`. Chain ID 31337.
- **testnet:** Monad testnet. See `monad.md`.

## Pipeline
1. CI runs `forge test` + `forge fmt --check` + `pnpm lint` + `pnpm test` on every PR.
2. On merge to `main`, a deploy workflow (manual trigger) runs:
   - `forge script script/Deploy.s.sol --rpc-url $MONAD_TESTNET_RPC --broadcast`
   - uploads broadcast JSON to `contracts/broadcast/`.
3. Frontend auto-deploys to Vercel (preview per PR, prod on `main`).

## Secrets
- `MONAD_TESTNET_RPC` — public URL is fine (rate-limited but public).
- `DEPLOYER_PRIVATE_KEY` — test wallet key (NEVER commit).
- `PINATA_API_KEY` / `PINATA_SECRET` — for IPFS uploads.

## Env files
- `.env.example` checked in (no secrets).
- Real `.env` ignored.
