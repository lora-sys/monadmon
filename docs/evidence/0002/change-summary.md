# Change Summary — ISSUE-0002 + 0007 + 0008 + 0009 + 0011 + 0012 (Frontend MVP)

## What
Full Next.js 14 frontend for MonadMon MVP:

- **Wallet:** wagmi v2 + viem v2 + RainbowKit v2 wired to Monad testnet (chain 10143).
- **Pages:** Landing, Mint + Hatch, Monster detail, Train list, Battle Arena, Leaderboard, Profile.
- **State hooks:** typed wrappers over MonsterNFT / GenesisMinter / Battle ABIs.
- **Styling:** Tailwind v3 + CSS variables matching `docs/design/tokens.md`.
- **Animation:** framer-motion hatch sequence (scale + rotate + opacity).
- **Data:** `frontend/public/data/species.json` (12 species × 4 stages).
- **Art:** Pollinations batch output committed under `frontend/public/assets/monsters/`.

## Why
- Closes MVP acceptance criteria AC1.x (wallet), AC4.x (monster detail), AC7.x (leaderboard page), AC8.x (showcase).
- Mint/Hatch/Train/Battle pages are thin wrappers over the contracts shipped in PR #20.

## Pages (smoke tested)
- `GET /` → 200 (14s first compile, then <100ms)
- `GET /mint` → 200
- `GET /train` → 200
- `GET /arena` → 200
- `GET /leaderboard` → 200
- `GET /data/species.json` → 200
- `GET /assets/monsters/1/stage0.png` → 200

## Build
`pnpm build` succeeds. All 9 routes compile (7 static + 2 dynamic).

## Acceptance Criteria
- [x] AC1.1 — Connection persists across reloads (wagmi cookie/localStorage).
- [x] AC1.2 — Wrong-network banner via RainbowKit.
- [x] AC2.x — Mint UI calls `MonsterNFT.mintGenesis` + one-egg-per-wallet gate.
- [x] AC3.x — Hatch UI calls `MonsterNFT.hatch(tokenId)` with hatch animation.
- [x] AC4.x — Monster detail renders full struct + DNA hex + art from species catalog.
- [x] AC5.x — Train UI calls `MonsterNFT.train(tokenId)` with 6h cooldown countdown.
- [x] AC6.x — Arena UI creates challenges and accepts (Battle contract flows).
- [x] AC7.x — Leaderboard page renders top-N table (static demo data; indexer in Phase 2).
- [x] AC8.x — Profile page lists owned monsters (with tokenId iteration).

## Notes / deferred
- Leaderboard uses static demo data. Phase 2 wires an indexer that scans `BattleResolved` events.
- Profile enumerates token IDs 1..balanceOf; for wallets with >12 monsters this is incomplete. Phase 2 uses an indexer with full ownership history.
- IPFS-hosted tokenURI metadata lands in Phase 2 with Pinata integration.
