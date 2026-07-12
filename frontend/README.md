# MonadMon Frontend

Next.js 14 (App Router) + TypeScript + Tailwind + wagmi v2 + viem v2 + RainbowKit v2.

## Stack
- **Next.js 14** App Router
- **TypeScript** strict
- **Tailwind v3** + CSS variables (per `docs/design/tokens.md`)
- **wagmi v2** + **viem v2** for wallet + contract reads/writes
- **RainbowKit v2** for the wallet picker
- **framer-motion v11** for hatch animation

## Pages
- `/` — landing
- `/mint` — Genesis Egg mint + hatch (one per wallet)
- `/monster/[tokenId]` — monster detail (stats, DNA, art)
- `/train` — train any owned monster (6h cooldown)
- `/arena` — PvP challenges (create + accept + recent log)
- `/leaderboard` — top 100 (Phase 2 wires indexer)
- `/profile/[address]` — public showcase

## Local dev
```bash
# install
pnpm install

# set env
cp .env.local.example .env.local
# fill NEXT_PUBLIC_*_ADDRESS after testnet deploy (or use localhost for Anvil)

# run
pnpm dev   # http://localhost:3000
```

## Build
```bash
pnpm build
pnpm start
```

## Type-check
```bash
npx tsc --noEmit
```

## Smoke (against local Anvil)
```bash
# 1. Start anvil + deploy contracts (from repo root)
anvil &
cd contracts && forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast

# 2. Copy the deployed addresses into frontend/.env.local

# 3. Start the dev server
cd frontend && pnpm dev

# 4. Open http://localhost:3000, connect MetaMask (import anvil dev key),
#    mint + hatch + train + battle.
```

## Notes
- Contract addresses are env-driven; see `lib/contracts.ts`.
- For Monad testnet, see `docs/architecture/monad.md` for the pinned chain id (10143).
- The art pipeline is in `scripts/generate-monsters.mjs` and committed to `frontend/public/assets/monsters/`. Phase 2 swaps this for IPFS-hosted assets.
