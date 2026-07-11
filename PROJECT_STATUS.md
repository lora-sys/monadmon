# Project Status

_Last updated: 2026-07-11 by @coordinator_

## Now (in progress)
- Phase 1 kickoff — Coordinator standing by for ISSUE-0001 (Foundry workspace) and ISSUE-0002 (Next.js workspace). ISSUE-0003 splits into ISSUE-0003a (species.json) and ISSUE-0003b (Pollinations batch run + manual cull).

## Backlog
- ISSUE-0001 — Initialize Foundry workspace, Foundry.toml, OZ v5 dependency, deploy script skeleton (owner: @backend, size: S, blocked on: nothing)
- ISSUE-0002 — Initialize Next.js 14 frontend workspace with viem + wagmi + RainbowKit, dark mode first (owner: @frontend, size: S, blocked on: nothing)
- ISSUE-0003a — Author `frontend/public/data/species.json` with 12 species × 4 stages = 48 entries (owner: @design, size: M, blocked on: nothing)
- ISSUE-0003b — Run `scripts/generate-monsters.mjs`, manual cull, commit approved art + manifest (owner: @design + @frontend, size: M, blocked on: ISSUE-0003a, ADR-0001)
- ISSUE-0004 — `MonsterNFT.sol` ERC-721 with speciesId, level, xp, dna, stats (owner: @backend, size: M, blocked on: ISSUE-0001)
- ISSUE-0005 — `ItemNFT.sol` ERC-1155 scaffold (no mint yet) (owner: @backend, size: S, blocked on: ISSUE-0001)
- ISSUE-0006 — `MonsterNFT.hatch(tokenId)` single-tx using `block.prevrandao` (ADR-0004) (owner: @backend, size: M, blocked on: ISSUE-0004)
- ISSUE-0007 — Frontend: Landing → Connect Wallet → Mint Egg → Hatch → See Monster (owner: @frontend, size: M, blocked on: ISSUE-0003b, ISSUE-0006)
- ISSUE-0008 — Frontend: Monster detail page (stats, DNA, evolution timeline) (owner: @frontend, size: M, blocked on: ISSUE-0007)
- ISSUE-0009 — Frontend: Training page (cooldowns, +XP/+ATK) (owner: @frontend, size: M, blocked on: ISSUE-0006)
- ISSUE-0010 — `Battle.sol` PvP resolver with type effectiveness (owner: @backend, size: M, blocked on: ISSUE-0004)
- ISSUE-0011 — Frontend: Battle Arena (challenge, accept, replay, winner) (owner: @frontend, size: L, blocked on: ISSUE-0010)
- ISSUE-0012 — Leaderboard page (top 100, your rank) (owner: @frontend, size: M)
- ISSUE-0013 — Re-verify Pollinations free-tier availability + record in `sessions/<id>/pollinations-check.md` (owner: @coordinator, size: XS, must complete before ISSUE-0003b)
- ISSUE-0014 — Re-verify Monad testnet RPC + chain ID + faucet at start of Phase 1 (owner: @coordinator, size: XS)
- ISSUE-0015 — Demo script + 5-minute walkthrough capture (owner: @frontend, size: M, blocked on: ISSUE-0012)

## Blocked (Waiting for Approval / external)
- (none — all four ADRs resolved)

## Recently Merged
- bootstrap commit `913aae0` — harness scaffold + PRD + MVP + architecture + design + 3 pending ADRs (merged 2026-07-11)

## Open Reviewer Threads
- (none yet)

## Phase
- Phase 0 — Bootstrap — **Done**
- Phase 1 — Core shell (repo + deploy + wallet) — Planned
- Phase 2 — Genesis Egg + Hatch — Planned
- Phase 3 — Training + Monster detail — Planned
- Phase 4 — PvP Battle + Leaderboard — Planned
- Phase 5 — Polish & demo — Planned

## Health
- Tests: n/a (no code yet)
- CI: n/a
- Docs freshness: see `docs/.index/freshness.json`
- Memory: seeded in `memory/`

## Risks
- R1 ~~Foundry not installed on the dev machine~~ — user accepted Option A; install via `foundryup`. Coordinator records in session log at start of Phase 1.
- R2 ~~Chainlink VRF not on Monad testnet~~ — accepted; use `block.prevrandao` behind `IRandomSource` (ADR-0004).
- R3 ~~Monster art method unresolved~~ — accepted; Pollinations + manual cull (ADR-0001).
- R4: Pollinations availability must be re-verified at start of Phase 1 (Issue 0013).
- R5: Monad testnet RPC and chain ID must be re-verified at start of Phase 1 (Issue 0014).
