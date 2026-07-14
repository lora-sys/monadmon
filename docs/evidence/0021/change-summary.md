# Change Summary — ISSUE-0021

Recovery branch `fix/33-live-e2e-rebuild` against `b0afa48`. The MVP claim
that AC7.1 ("leaderboard ranked by battles won") was verified is replaced
by the following evidence-based corrections.

## What changed

- **Backend indexer rewritten** (`backend/src/indexer.ts:1-320`).
  The inline `parseAbiItem` strings are hoisted to module-level
  constants, the winner/loser mapping now uses the participant
  struct (`participantForToken`) instead of a token-id / address
  compare, post-battle monster refresh is awaited, and block
  timestamps are persisted from `client.getBlock` (cached per range).
  A new `syncIndexer(client, db, chainId, cfg, lastBlock)` public
  function is the single entry point used by both the runtime loop
  and the test suite.
- **Backend ABI and limits** (`backend/src/abis.ts:99-103`,
  `backend/src/server.ts:5-15, 41-65`). `ChallengeCreated` is
  declared with only the first three fields `indexed: true`,
  matching Solidity. Limit query parameters are strictly integer-
  parsed; non-positive or non-numeric values yield `400 invalid limit`.
- **Backend tests** (`backend/test/{db,server,indexer}.test.ts`,
  `backend/tsconfig.test.json`). 9 vitest tests assert the indexed
  layout, decoded event payload, replay idempotency, leaderboard
  ordering, case-insensitive owner lookups, and the 400 path.
- **Frontend live leaderboard** (`frontend/lib/indexer.ts:1-93`,
  `frontend/components/LeaderboardView.tsx:1-122`,
  `frontend/app/leaderboard/page.tsx:1-37`). The static demo table
  and the "Phase 2 wires this" copy are gone. The page now uses
  `useQuery` to fetch the indexer URL (default
  `http://127.0.0.1:3001`, overridable via
  `NEXT_PUBLIC_INDEXER_URL`), with explicit loading / populated /
  empty / unavailable states and a `role="status"` for the empty
  branch.
- **Frontend profile correctness**
  (`frontend/lib/indexer.ts:36-93`,
  `frontend/app/profile/[address]/page.tsx:1-110`). The previous
  implementation derived token IDs from `balanceOf(N)` and rendered
  `1..N`, which is incorrect for non-monotonic mints. The page now
  asks the indexer for the owner's real token IDs and links to
  each one individually. Bob's profile is verified to render
  EmberFox at `/monster/2`, Alice's to render MossGolem at
  `/monster/1` in the new pack.
- **Frontend monster art and ARIA**
  (`frontend/lib/species.ts:38-44`,
  `frontend/app/monster/[tokenId]/page.tsx:74-152`,
  `frontend/app/profile/[address]/page.tsx:55-89`,
  `frontend/app/train/page.tsx:91-96`,
  `frontend/app/arena/page.tsx:114-167`,
  `frontend/components/Header.tsx:1-42`,
  `frontend/app/globals.css:5-13`,
  `docs/design/tokens.md`). Art paths are deterministic
  (`/assets/monsters/{id}/stage{n}.png`); a sr-only
  `role="progressbar"` reports XP progress; the empty leaderboard
  is announced via `aria-live`; the Train button exposes its
  cooldown label; "Connect your wallet" is a real button; the
  primary text token is darkened to `#858DA1` and the Fire / Water
  / Electric element chips are darkened to stay above WCAG AA.
- **CI test gates**
  (`.github/workflows/ci.yml:69-92`). The backend and frontend
  jobs now invoke `npm test` in addition to typecheck and build.
- **Deterministic local E2E**
  (`scripts/local-e2e.sh:1-260`, `backend/run-indexer.sh:1-15`,
  `scripts/run-browser-evidence.sh:1-130`). The fresh-Anvil driver
  reuses the same shared OpenZeppelin cache as the main worktree,
  aborts if the chosen ports are already bound, mints and battles
  for two Anvil accounts, captures the on-chain receipts as JSON,
  asserts the leaderboard reflects the battle result, restarts the
  indexer, and asserts restart idempotency. The browser evidence
  script captures desktop and mobile screenshots for
  populated / empty / unavailable leaderboard, monster detail,
  and both profile pages, plus `axe-core` reports written to
  `docs/evidence/0021/test-results/axe-*.json`.
- **Documentation** (`docs/design/tokens.md:46-58`,
  `frontend/.env.example:1-9`,
  `frontend/lib/wagmi.ts:1-16`). The WalletConnect project id is now
  only used when `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set; a
  documented fallback emits only an injected browser wallet.

## Risk and rollback
Reversible. The rebase is local-only; reverting the merge restores the
old static page, the broken indexer ABI, and the no-test backend. No
schema migration, no mint authority change, no wallet signature flow
touched. If the production deploy had shipped, the same rollback
applies on the testnet.

## Required reviewers (per `AGENTS.md` §6)
- bug-hunter — done; Critical/High resolved before this summary.
- architecture-reviewer — done; new seams make the indexer testable.
- security-reviewer — done; CORS left as documented MVP scope.
- ui-reviewer — done; all axe reports zero, contrasts re-checked.
