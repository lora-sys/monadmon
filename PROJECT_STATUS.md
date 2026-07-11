# Project Status

_Last updated: 2026-07-11 by @coordinator_

## Now (in progress)
- Bootstrap — Coordinator is drafting the harness docs and asking the user the three critical design questions (art, contracts, RNG). See `sessions/current-session.md`.

## Backlog
- ISSUE-0001 — Initialize Foundry workspace, Foundry.toml, dependencies, deploy script skeleton (owner: @backend, size: S, blocked on: ADR-0002)
- ISSUE-0002 — Initialize Next.js 14 frontend workspace with viem + wagmi + RainbowKit, dark mode first (owner: @frontend, size: S, blocked on: ADR-0003)
- ISSUE-0003 — Monster species catalog (12 species × 3 stages = 36 art assets + JSON metadata) (owner: @design + @frontend, size: L, blocked on: ADR-0001)
- ISSUE-0004 — `MonsterNFT.sol` ERC-721 with speciesId, level, xp, dna, stats (owner: @backend, size: M, blocked on: ISSUE-0001, ADR-0004)
- ISSUE-0005 — `ItemNFT.sol` ERC-1155 for items (stones, candies, cores) (owner: @backend, size: S)
- ISSUE-0006 — Genesis Egg mint + hatch reveal (commit-reveal RNG) (owner: @backend, size: M, blocked on: ISSUE-0004, ADR-0004)
- ISSUE-0007 — Frontend: Landing → Connect Wallet → Mint Egg → Hatch → See Monster (owner: @frontend, size: M, blocked on: ISSUE-0003, ISSUE-0006)
- ISSUE-0008 — Frontend: Monster detail page (stats, DNA, evolution timeline) (owner: @frontend, size: M)
- ISSUE-0009 — Frontend: Training page (cooldowns, +EXP/ATK) (owner: @frontend, size: M, blocked on: ISSUE-0004)
- ISSUE-0010 — `Battle.sol` PvP resolver with type effectiveness (owner: @backend, size: M, blocked on: ISSUE-0004)
- ISSUE-0011 — Frontend: Battle Arena (challenge, watch log, see winner) (owner: @frontend, size: L, blocked on: ISSUE-0010)
- ISSUE-0012 — Leaderboard page (top 100, scroll, your rank) (owner: @frontend, size: M)

## Blocked (Waiting for Approval / external)
- ADR-0001 — Monster art generation method (needs user decision: A pre-designed AI/digital-art batch, B procedural via PixelLab/pixel-sprite-generator, C SDXL/ComfyUI batch + curation)
- ADR-0002 — Contract dev environment (needs user decision: Foundry vs Hardhat; Foundry not installed locally)
- ADR-0004 — Randomness source (needs user decision: commit-reveal on Monad, Chainlink VRF if available, off-chain signed oracle)

## Recently Merged
- (none yet)

## Open Reviewer Threads
- (none yet)

## Phase
- Phase 0 — Bootstrap — In Progress
- Phase 1 — Core shell (repo + deploy + wallet) — Planned
- Phase 2 — Genesis Egg + Hatch — Planned
- Phase 3 — Training + Monster detail — Planned
- Phase 4 — PvP Battle + Leaderboard — Planned
- Phase 5 — Polish & demo — Planned

## Health
- Tests: n/a (no code yet)
- CI: n/a
- Docs freshness: see `docs/.index/freshness.json` (will be generated this session)
- Memory: seeded in `memory/`

## Risks
- R1: Foundry not installed on the dev machine — see ADR-0002.
- R2: No Chainlink VRF on Monad testnet as of 2026-Q1 — see ADR-0004.
- R3: Monster art method unresolved — see ADR-0001.
- R4: Monad testnet RPC and chain ID details should be re-verified at start of Phase 1.
