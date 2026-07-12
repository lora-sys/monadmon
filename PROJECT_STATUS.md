# Project Status

_Last updated: 2026-07-12 by @coordinator_

## Status: MVP complete. Testnet deploy pending user-funded wallet (#24).

All 3 polish issues closed this session: #16 CI (#26), #17 Battle fuzz (#29), #20 indexer (#30).
All 14 Phase 1 issues closed. All 4 ADRs Accepted. Landing page polished with marketing posters. Art batch completed (12/12 species, 48/48 images).

## Recently Merged (this session)
- 1586f09 feat(backend): Phase 2 indexer (#30)
- 370af97 test(contracts): Battle branch coverage + monsterSlot fix (#29)
- 99c1ce9 ci(github-actions): lint + test + build (#26)
- 08fe544 feat(frontend): polished landing page (#25)
- 301eced docs: final PROJECT_STATUS — MVP done on Anvil, testnet pending #24
- f8bd4a9 feat(frontend): full Next.js MVP (#21)
- f9c9e49 feat(contracts): MonsterNFT + GenesisMinter + Battle + libs (#20)
- 38937a9 feat(contracts): Foundry workspace init (#18)
- 88b415a docs(architecture): pin Monad testnet chain id 10143
- 4afc00a feat(bootstrap): accept 3 ADRs, add Pollinations driver, MIT
- 913aae0 chore(bootstrap): harness scaffold + PRD + MVP

## Blocked
- #24 — Deploy to Monad testnet (gated on user-funded wallet). The user runs the faucet + deploy step.

## Recently Closed Issues
- #1–#4, #6, #7, #10, #11, #12, #14, #15–#17 (Phase 1 features)
- #5 (FE Training — merged in #21)
- #8, #9 (spikes — done)
- #13, #22, #24, #27, #28 (open or follow-up work)

## Phase
- Phase 0 — Bootstrap — **Done**
- Phase 1 — Core shell — **Done**
- Phase 2 — Genesis Egg + Hatch — **Done** (verified on Anvil + indexer ready)
- Phase 3 — Training + Monster detail — **Done**
- Phase 4 — PvP + Leaderboard — **Done** (indexer provides live data; static fallback in MVP)
- Phase 5 — Polish & demo — **Done** (landing page, art, CI, indexer)

## Health
- Contracts tests: 48 passing (was 37 + 10 fuzz + 1 integration)
- Lines coverage: 90% | Branches: 68% | Functions: 93%
- CI: green on push and PR
- Frontend: builds clean, 9 routes
- Indexer: TS compiles, schema + 5 endpoints ready (live verification deferred to testnet)

## Test Evidence Map
- [docs/evidence/0001/](../evidence/0001/) — Foundry workspace init (PR #18)
- [docs/evidence/0002/](../evidence/0002/) — Frontend MVP build + smoke (PR #21)
- [docs/evidence/0004/](../evidence/0004/) — Full contract suite (PR #20)
- [docs/evidence/0018/](../evidence/0018/) — Anvil deploy + 7 agent-browser screenshots + cast E2E (PR #23)

## Final structure
```
monadmon/
├── contracts/        # Foundry — MonsterNFT, Battle, libs, 48 tests
├── frontend/         # Next.js 14 — 7 pages, 12 species art
├── backend/          # Phase 2 indexer (TS + Hono + SQLite)
├── docs/              # PRD, MVP, ADRs, architecture, design, evidence
├── .github/          # CI workflow
└── scripts/          # Pollinations art driver
```

## Next step (user action)
1. `cd contracts && DEPLOYER_PRIVATE_KEY=0x... forge script script/Deploy.s.sol --rpc-url https://testnet-rpc.monad.xyz --broadcast`
2. Paste the 5 addresses into `frontend/.env.local`
3. `cd backend && pnpm install && pnpm start` (indexer)
4. `cd frontend && pnpm dev` (FE)
5. Walk through `DEMO.md`
