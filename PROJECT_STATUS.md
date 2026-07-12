# Project Status

_Last updated: 2026-07-12 by @coordinator_

## Now (in progress)
- Pollinations art batch completing in background (EmberFox done; 11 species to go).
- Final polish + demo script.

## Backlog
- ISSUE-0019 — Deploy to Monad testnet (gated on funded wallet — user action).
- ISSUE-0016 — CI workflow (.github/workflows/{lint,test,build}.yml).
- ISSUE-0017 — Battle branch coverage fuzz (per PR #20 review).
- ISSUE-0020 — Phase 2 indexer for Leaderboard + Profile ownership history.

## Blocked (Waiting for Approval / external)
- (none)

## Recently Merged
- PR #23 — ISSUE-0018 local Anvil deploy + agent-browser E2E (merged 2026-07-12)
- PR #21 — Frontend MVP (all 7 pages) (merged 2026-07-11)
- PR #20 — Contract suite (MonsterNFT + GenesisMinter + Battle + libs) (merged 2026-07-11)
- PR #18 — ISSUE-0001 Foundry workspace init (merged 2026-07-11)

## Open Reviewer Threads
- (none — all PRs merged with full evidence)

## Phase
- Phase 0 — Bootstrap — **Done**
- Phase 1 — Core shell (repo + deploy + wallet) — **Done**
- Phase 2 — Genesis Egg + Hatch — **Done** (verified on Anvil)
- Phase 3 — Training + Monster detail — **Done** (verified on Anvil)
- Phase 4 — PvP Battle + Leaderboard — **Done** (verified on Anvil; indexer in Phase 2)
- Phase 5 — Polish & demo — **In Progress**

## Health
- Tests: 37 passing (PR #20 contracts), 0 failing
- CI: not configured yet (ISSUE-0016)
- Docs freshness: see docs/.index/freshness.json
- Memory: in memory/
- Coverage: contracts 85% line / 93% function; FE build clean

## MVP Acceptance Criteria Status
| AC | Description | Status |
|----|-------------|--------|
| AC1.x | Connect wallet | FE implemented; agent-browser cannot exercise real MetaMask in headless; user-validated |
| AC2.1 | AlreadyMinted | ✅ verified by MonsterNFT.t.sol |
| AC2.2 | Mint gives egg | ✅ verified by E2E (PR #23) |
| AC3.1 | Rarity 50/30/20 within ±5% | ✅ RarityRoll.t.sol 10k fuzz + 10k seed sweep |
| AC3.2 | Deterministic DNA | ✅ verified by E2E (Alice re-hatch → same DNA) |
| AC4.x | Monster detail page | ✅ screenshot 03-monster-detail.png |
| AC5.1 | Cooldown revert | ✅ MonsterNFT.t.sol |
| AC5.2 | XP growth + level up | ✅ verified by E2E (30 → 80) |
| AC6.1 | Battle determinism | ✅ Battle.t.sol + integration test |
| AC6.2 | Type effectiveness | ✅ TypeChart.t.sol golden vector |
| AC6.3 | BattleResolved event | ✅ verified by E2E |
| AC7.1 | Leaderboard page | ✅ screenshot 02-leaderboard.png (static demo; live indexer is Phase 2) |
| AC8.x | Showcase profile | ✅ page exists; full ownership scan is Phase 2 |

## Risks
- R1 ~~Foundry not installed~~ — installed via foundryup. Resolved.
- R2 ~~Chainlink VRF not on Monad~~ — using block.prevrandao per ADR-0004. Resolved.
- R3 ~~Art method unresolved~~ — Pollinations locked in ADR-0001. Resolved.
- R4 — Pollinations availability must be re-verified at Phase 1 start. Mitigated (probed 2026-07-11).
- R5 — Monad testnet RPC pinned. Re-verified 2026-07-11.
- R6 — Art batch is currently the only blocking concern for a polished demo; we ship with EmberFox art + placeholder for other species.
