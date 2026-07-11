# MonadMon

> The first living creatures on Monad. An on-chain creature-raising and PvP battle game where every Monster is truly owned by its player.

**License:** MIT. See [`LICENSE`](LICENSE).

This repo is bootstrapped under the [ai-engineering-harness](AGENTS.md) workflow. Read [`AGENTS.md`](AGENTS.md) before contributing — it is the source of truth for every AI agent and human contributor.

## Read first
- [`docs/INDEX.md`](docs/INDEX.md) — master documentation index.
- [`docs/product/prd.md`](docs/product/prd.md) — product requirements.
- [`docs/product/mvp.md`](docs/product/mvp.md) — narrow MVP scope.
- [`docs/design/monster-system.md`](docs/design/monster-system.md) — the critical design (species, DNA, art).
- [`docs/decisions/`](docs/decisions/) — ADR log.

## Stack (locked)
- **Chain:** Monad testnet (EVM-compatible L1).
- **Contracts:** Solidity ^0.8.24 + OpenZeppelin v5 + **Foundry** ([ADR-0002](docs/decisions/ADR-0002-contract-stack.md)).
- **Frontend:** Next.js 14 + wagmi v2 + viem v2 + RainbowKit v2 + Tailwind + framer-motion ([ADR-0003](docs/decisions/ADR-0003-frontend-stack.md)).
- **Art:** [Pollinations.ai](https://pollinations.ai) `flux`, batch via [`scripts/generate-monsters.mjs`](scripts/generate-monsters.mjs), zero API key ([ADR-0001](docs/decisions/ADR-0001-monster-art.md)).
- **RNG:** single-tx hatch using `block.prevrandao`, behind `IRandomSource` ([ADR-0004](docs/decisions/ADR-0004-rng-source.md)).

## Project status
See [`PROJECT_STATUS.md`](PROJECT_STATUS.md). Current phase: **Phase 0 — Bootstrap — Done.** Next: Phase 1 — Core shell.

## Next concrete step
Open ISSUE-0001 (Foundry workspace init) and ISSUE-0002 (Next.js workspace init) in parallel.

## Quick start (once Phase 1 lands)
```bash
# install Foundry (one-time)
curl -L https://foundry.paradigm.xyz | bash && foundryup

# contracts
cd contracts && forge test

# frontend
cd frontend && pnpm install && pnpm dev
```

## Generate art
```bash
node scripts/generate-monsters.mjs                # full batch
node scripts/generate-monsters.mjs --only=emberfox
node scripts/generate-monsters.mjs --variants=false
```
