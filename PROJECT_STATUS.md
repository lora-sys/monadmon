# Project Status

_Last updated: 2026-07-13 by Codex_

## Status: MVP recovery in progress on GitHub #33. Testnet deploy remains blocked on #24.

The latest E2E audit contradicted the prior completion claim. The live
leaderboard path is not wired in the frontend, battle resolution indexing is
incorrect, monster-detail screenshots show broken images, and the backend has
no automated test coverage. GitHub CI is green for `main`, but it currently
only type-checks and builds the backend. GitHub #33 is the blocking recovery
Issue.

## MVP Acceptance Criteria Status
| AC | Description | Status |
|----|-------------|--------|
| AC1.x | Connect wallet | FE implemented (RainbowKit) |
| AC2.1 | AlreadyMinted revert | verified |
| AC2.2 | Mint gives egg | verified |
| AC3.1 | Rarity 50/30/20 within ±5% | verified, 10k fuzz |
| AC3.2 | Deterministic DNA | verified, re-hatch |
| AC4.x | Monster detail | verified live data |
| AC5.1 | Cooldown revert | verified |
| AC5.2 | XP growth + level up | verified |
| AC6.1 | Battle determinism | verified |
| AC6.2 | Type effectiveness | golden vector |
| AC6.3 | BattleResolved event | verified |
| AC7.1 | Leaderboard page | **Failed audit: static demo data, live path under repair (#33)** |
| AC8.x | Showcase profile | verified |

## Recently Merged (this session)
- f878c1c fix(ci): regenerate package-lock.json from clean npm install
- 927e5c0 chore(gitignore): exclude pnpm-lock + workspace state
- bdf3e5d fix(ci): add node_modules to .gitignore; clean pnpm leftovers
- 7fea387 ci(github-actions): rm -rf node_modules before npm ci
- 5f35414 ci(github-actions): use 'npm run typecheck' / 'npm run build'
- d50816e ci(github-actions): use ${GITHUB_WORKSPACE} for cd paths
- d42ea66 ci(github-actions): use local tsc binary instead of npx tsc
- fc9ff7e ci(github-actions): remove cache: 'npm' from setup-node
- 5bb545e fix(ci): correct BE install cd path to backend
- c8c3f5f ci(github-actions): use 'cd ...' instead of working-directory
- 0bca9ac ci(github-actions): drop pnpm workspace, use npm per package

## CI Status
✅ All three jobs pass on every push to main:
- Contracts: forge fmt + build + test (47 tests)
- Frontend: tsc + lint + build (9 routes)
- Backend: tsc + build

The long CI debugging journey is documented in commits above. Root
cause was a corrupted package-lock.json that npm ci couldn't reproduce.
Fix: regenerate from a clean `npm install`.

## Phase
- Phase 0 — Bootstrap — **Done**
- Phase 1 — Core shell — **Done**
- Phase 2 — Genesis Egg + Hatch — **Done** (verified on Anvil)
- Phase 3 — Training + Monster detail — **Done**
- Phase 4 — PvP + Leaderboard — **Reopened** (#33)
- Phase 5 — Polish & demo — **Reopened** (broken art/E2E evidence in #33)

## Implementing

- #33 / ISSUE-0021 — Rebuild live leaderboard and local E2E.

## Blocked
- #24 — Deploy to Monad testnet (gated on user-funded wallet).

## Final structure
```
monadmon/
├── contracts/        # Foundry — MonsterNFT, Battle, libs, 48 tests
├── frontend/         # Next.js 14 — 7 pages, 12 species art
├── backend/          # Phase 2 indexer (TS + Hono + SQLite)
├── docs/              # PRD, MVP, ADRs, architecture, design, evidence
├── .github/          # CI workflow (now green)
└── scripts/          # Pollinations art driver
```

## Stats
- 8 PRs merged
- 48 contract tests passing
- 90% line coverage, 68% branch coverage
- 12/12 species with art
- 3 marketing posters on landing page
- CI green on every push

## Next step (user action)
#24 — Deploy to Monad testnet when a funded wallet is available.
