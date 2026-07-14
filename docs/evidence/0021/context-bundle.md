# Context Bundle: ISSUE-0021

GitHub Issue: #33
Branch: `fix/33-live-e2e-rebuild`
Generated: 2026-07-13

## L0

- `AGENTS.md`: Issue-first, worktree-isolated delivery; CI, evidence, and cold
  reviews are blocking gates.
- `ENGINEERING.md`: strict TypeScript, Foundry contracts, Next.js App Router,
  mandatory UI review for frontend changes.
- `TESTING.md`: backend fixtures, desktop/mobile browser evidence, clean
  console, and no serious/critical accessibility findings.

## L1

- GitHub #33 acceptance criteria and allow-list.
- `docs/product/mvp.md`: AC7.1 requires a leaderboard ranked by battles won.
- `docs/product/feature-specs/leaderboard.md`: leaderboard product contract.
- `docs/product/feature-specs/pvp-battle.md`: challenge and resolution contract.
- `docs/architecture/backend.md`: indexer, SQLite, and read API boundaries.
- `docs/design/ui-patterns.md`: leaderboard and state presentation.

## Current-State Findings

1. `contracts/src/Battle.sol` is correct: `ChallengeCreated` indexes only
   `challengeId`, `challenger`, and `opponent`. The backend ABI and inline
   event signature incorrectly mark both token IDs as indexed.
2. `handleChallengeResolved` compares an address with a token ID while mapping
   the winner and loser. A non-draw resolution therefore cannot reliably
   populate trainer addresses or leaderboard rows.
3. The async post-battle monster refresh is not awaited before the indexed
   block checkpoint advances.
4. RPC log objects do not carry `blockTimestamp`, so the current persisted
   timestamp is always zero unless the indexer explicitly loads the block.
5. `frontend/app/leaderboard/page.tsx` renders five hard-coded demo entries and
   does not call the backend.
6. Existing monster-detail screenshots show broken images for species that
   have committed PNG assets.
7. The backend has no tests and GitHub CI only type-checks and builds it.
8. Existing E2E evidence lacks a populated live leaderboard, mobile captures,
   browser-console logs, accessibility output, and replay/restart proof.

## External Evidence

- Latest audit attachment:
  `/home/lora/.codex/attachments/5c520104-5049-4f0f-9578-e9808454ec95/pasted-text-1.txt`
- Main commit `b0afa48` has three successful GitHub checks, but none executes
  backend tests.
- `docs/evidence/e2e/06-leaderboard.png` visibly contains static demo rows and
  future-tense Phase 2 copy.
- `docs/evidence/e2e/03-monster-detail-alice.png` and
  `04-monster-detail-bob.png` visibly contain broken image elements.

## Human Gate

No human approval gate is required for this local-only bug fix. Monad testnet
deployment remains separately blocked on Issue #24 and is out of scope.
