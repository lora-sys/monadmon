# Project Status

_Last updated: 2026-07-12 by @coordinator_

## MVP STATUS: ✅ Done on local Anvil. Pending testnet deploy (Issue #24).

All MVP acceptance criteria (AC1.x through AC8.x) are verified on local
Anvil via cast + agent-browser screenshots. The remaining work for the
public demo is the testnet deploy (#24), which needs a user-funded wallet.

## Recently Merged (this session)
- 26bb752 feat(art): FlameBird partial — 11/48 images so far
- 3ba8c1b feat(art): FlameBird partial — 3/12 species in progress
- 953bdf8 feat(art): MagmaTurtle full hero set
- 46e52d2 docs: DEMO.md walkthrough + art-detached wrapper
- afccb00 feat(art): EmberFox full hero set
- 0843cf5 docs: ISSUE-0018 local Anvil E2E (#23)
- f8bd4a9 feat(frontend): full Next.js MVP (#21)
- f9c9e49 feat(contracts): MonsterNFT + GenesisMinter + Battle + libs (#20)
- 38937a9 feat(contracts): ISSUE-0001 Foundry workspace init (#18)
- 88b415a docs(architecture): pin Monad testnet chain id 10143
- 4afc00a feat(bootstrap): accept 3 ADRs, add Pollinations driver, MIT
- 913aae0 chore(bootstrap): harness scaffold + PRD + MVP

## Backlog
- #24 — Deploy to Monad testnet (gated on funded wallet — user action required).
- #16 — CI workflow (.github/workflows/{lint,test,build}.yml).
- #17 — Battle branch coverage fuzz.
- #20 — Phase 2 indexer for Leaderboard + Profile ownership history.
- (NEW) — Complete Pollinations art batch (in progress; 11/48 images done).

## Open Reviewer Threads
- (none)

## Phase
- Phase 0 — Bootstrap — **Done**
- Phase 1 — Core shell (repo + deploy + wallet) — **Done**
- Phase 2 — Genesis Egg + Hatch — **Done** (verified on Anvil)
- Phase 3 — Training + Monster detail — **Done** (verified on Anvil)
- Phase 4 — PvP Battle + Leaderboard — **Done** (verified on Anvil)
- Phase 5 — Polish & demo — **In Progress**

## Health
- Tests: 37 passing (PR #20 contracts), 0 failing
- CI: not configured yet (#16)
- Docs freshness: see docs/.index/freshness.json
- Memory: in memory/
- Coverage: contracts 85% line / 93% function; FE build clean

## MVP Acceptance Criteria Status (full table)
| AC | Description | Status |
|----|-------------|--------|
| AC1.x | Connect wallet | FE implemented (RainbowKit); user-validated in browser |
| AC2.1 | AlreadyMinted revert | ✅ MonsterNFT.t.sol |
| AC2.2 | Mint gives egg with speciesId=0 | ✅ E2E |
| AC3.1 | Rarity 50/30/20 within ±5% | ✅ RarityRoll.t.sol 10k fuzz |
| AC3.2 | Deterministic DNA | ✅ E2E (Alice re-hatch → same DNA) |
| AC4.x | Monster detail page renders | ✅ screenshot 03 |
| AC5.1 | Cooldown revert | ✅ MonsterNFT.t.sol |
| AC5.2 | XP growth + level up | ✅ E2E (30 → 80) |
| AC6.1 | Battle determinism | ✅ Battle.t.sol + integration |
| AC6.2 | Type effectiveness golden vector | ✅ TypeChart.t.sol |
| AC6.3 | BattleResolved event | ✅ E2E |
| AC7.1 | Leaderboard page | ✅ screenshot 02 (static demo; indexer is Phase 2) |
| AC8.x | Showcase profile | ✅ page exists |

## Evidence Map
- `docs/evidence/0001/` — Foundry workspace init (PR #18)
- `docs/evidence/0002/` — Frontend MVP build + smoke (PR #21)
- `docs/evidence/0004/` — Full contract suite (PR #20)
- `docs/evidence/0018/` — Anvil deploy + 7 agent-browser screenshots + cast E2E trace (PR #23)
- `docs/evidence/0003b/` — Pollinations art batch + manual cull (in progress)

## Next milestone: Testnet demo
Issue #24. Unblocks once the user provides a funded wallet.
