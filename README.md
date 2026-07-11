# MonadMon

> The first living creatures on Monad. An on-chain creature-raising and PvP battle game where every Monster is truly owned by its player.

This repo is bootstrapped under the [ai-engineering-harness](../AGENTS.md) workflow. Read [`AGENTS.md`](AGENTS.md) before contributing — it is the source of truth for every AI agent and human contributor.

## Read first
- [`docs/INDEX.md`](docs/INDEX.md) — master documentation index.
- [`docs/product/prd.md`](docs/product/prd.md) — product requirements.
- [`docs/product/mvp.md`](docs/product/mvp.md) — narrow MVP scope.
- [`docs/design/monster-system.md`](docs/design/monster-system.md) — the critical design (species, DNA, art).
- [`docs/decisions/`](docs/decisions/) — ADR log.

## Project status
See [`PROJECT_STATUS.md`](PROJECT_STATUS.md). Current phase: **Phase 0 — Bootstrap** (in progress).

## Status of this build
- Repo scaffold complete.
- 3 ADRs pending user decision (art, contract stack, RNG).
- 12-Issue Phase 1 backlog ready.

## Quick start (once decisions land)
```bash
# install contract dev env (Option A: Foundry)
curl -L https://foundry.paradigm.xyz | bash && foundryup

# install frontend deps
cd frontend && pnpm install && pnpm dev
```

## License
TBD.
