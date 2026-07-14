# Verification — ISSUE-0021

> Single fresh-Anvil run on `9545/3201/3200` (and 9745/3401/3400 for empty/unavailable)
> used to produce every artifact in this evidence pack.

## Stack URLs
- Anvil RPC:        http://127.0.0.1:9545
- Indexer API:      http://127.0.0.1:3201
- Frontend:         http://127.0.0.1:3200

## On-chain happy path (fresh Anvil, deterministic Anvil accounts)
- `0xf39F…2266` (Alice/Deployer) calls `mintGenesis()` → tokenId 2, hashes/owner captured.
- `0xf39F…2266` calls `hatch(2)`, `train(2)`, `mintGenesis()` (tokenId 3), `hatch(3)`.
- `0x7099…79C8` (Bob) calls `mintGenesis()` → tokenId 4, `hatch(4)`.
- `0xf39F…2266` calls `challenge(2, 0x7099…, 4)` → challengeId 1.
- `0x7099…79C8` calls `acceptAndResolve(1)`.

Battle `getChallenge(1)` is persisted with `winner=0x7099…79C8`, `loser=0xf39F…2266`,
`turns=0`, `draw=false`, `block_number=9`, real `block_timestamp` from RPC
`getBlock` cache, and `tx_hash=0x447fb940…b06b39c` for the `ChallengeResolved` log.

## Indexer replay
- `syncIndexer` is called twice in the vitest suite on a fresh in-memory DB.
  Both runs end with checkpoint=20 and exactly one `battles` row.
- Replay on a populated disk DB after process restart leaves row count at 1
  and the leaderboard unchanged — verified by `scripts/local-e2e.sh` step 4.

## UI states captured
- Desktop 1440x900 and mobile 390x844 screenshots in `screenshots/`.
- axe-core (`frontend/lib/axe.min.js`) injected via `eval --stdin`; ruleset
  `wcag2a, wcag2aa, wcag21a, wcag21aa`. All eight runs reported
  `{"seriousOrCritical":[],"moderate":[]}`.
- Page identity, snapshot tree, and absence of `document.querySelector("[role=alert]")`
  on the empty state confirm the four states are rendered with the
  correct semantic markup.

## Test gates passed
- Contracts: 47 forge tests pass; contracts compile and `forge build` is green.
- Backend: `npm test` (9) + `tsc --noEmit` (incl. tests) + `tsc -p tsconfig.json` build.
- Frontend: `vitest run` (14 tests) + `tsc --noEmit` + `next lint` + `next build`
  with axe-core as a `devDependency` for the bundled runner.
