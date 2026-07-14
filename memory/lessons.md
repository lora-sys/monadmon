# Lessons Learned

Hard-won lessons from real work. Add only after a phase summary, not in passing.

(empty — populated after first Issue ships)

## 2026-07-14 — ISSUE-0021 (Live E2E rebuild)

- **Solidity events are capped at 3 indexed fields.** A 5-field
  `indexed: true` ABI lies to viem and produces wrong addresses for
  every decoded log; the symptom was empty `winner` / `loser` rows
  even though the on-chain data was correct. Always mirror the ABI
  `indexed` flag against the contract or split into two events.
- **viem RPC logs do not carry `blockTimestamp`.** Persist the
  timestamp by calling `client.getBlock({ blockNumber })` and
  caching the promise per range. The naive `Number(log.blockTimestamp)`
  always yielded zero.
- **Address vs token-id is the canonical battle-mapping footgun.**
  Persist `challengerTokenId` / `opponentTokenId` from
  `ChallengeCreated`, then map `winnerTokenId` to one of those two
  addresses by equality. Any direct compare between `address` and
  `uint256` corrupts the leaderboard silently.
- **Live-anvil E2E needs a real, restart-stable signal.**
  Skipping the backend between `ChallengeResolved` and the leaderboard
  read is the root cause of every "empty after battle" report. Make
  the indexer start the polling loop only after the API server is
  listening, and assert that the battle row plus the leaderboard row
  are present before the script reports success.
- **`next/image` can hide broken image assets.** Real JPEG bytes with
  a `.png` extension are routed through the optimizer, which may
  stall or return 0-byte responses when the upstream MIME mismatches.
  Either commit true PNGs or set `formats: ["image/jpeg"]` /
  `unoptimized: true` and document the choice.
- **Monolith browser sessions are flaky.** The agent-browser CLI
  shares one daemon; running 8 captures back-to-back exhausts
  memory and forces `--all` close. Capture in tight per-session
  scripts, close between states, and assert `session list` is empty
  before re-running.
- **Axe contrast gates need the design doc updated too.** Fixing the
  CSS color to satisfy WCAG is necessary but not sufficient: update
  `docs/design/tokens.md` in the same change so the next agent
  doesn't undo the fix. Keep the doc and the diff in lock-step.
- **Address normalisation has to live everywhere.** Mixed-case
  addresses from `cast` vs lowercase from `viem` caused the leaderboard
  query to miss rows. Always `toLowerCase()` at the storage boundary
  (`upsertBattle`, `upsertMonster`, `getMonstersByOwner`) and let the
  query keys match.
