# Verification — ISSUE-0021 (Live E2E + Creative Redesign)

## Stack
- Anvil RPC:        http://127.0.0.1:11445
- Indexer API:      http://127.0.0.1:11401
- Frontend:         http://127.0.0.1:11400

## On-chain happy path (fresh Anvil, deterministic Anvil accounts)
- `0xf39F…2266` (Alice/Deployer) mints → token 1, then hatches and
  trains.
- `0x7099…79C8` (Bob) mints → token 2, hatches.
- Alice challenges Bob; Bob accepts and resolves. This run
  produced `winner=Alice, loser=Bob, block_number=10,
  block_timestamp=1_784_000_830` (real RPC time).

## Indexer replay
- `syncIndexer` exercised twice in the vitest suite, both end on
  checkpoint=20 with exactly one `battles` row. Disk-DB restart in
  `scripts/local-e2e.sh` keeps the row count at 1.

## Visual evidence (creative redesign)

Desktop 1440x900:
- `screenshots/desktop/populated.png` — Alice ranked 1 with EmberFox,
  accent glow on rank chip, address `0xf39f…b92266`, monospace XP
  `80`. Reflowed to the new asymmetric 5/7 split with banner art.
- `screenshots/desktop/leaderboard-empty.png` — empty state with
  "No ranked trainers yet" headline and "Enter the arena" CTA.
- `screenshots/desktop/leaderboard-unavailable.png` — error state
  with red alert, "Try again" button, calm body.
- `screenshots/desktop/monster-2-emberfox.png` — EmberFox portrait
  (actually FlameBird on this run, species from `block.prevrandao`),
  60/40 split, breath animation, stat cards, training CTA.
- `screenshots/desktop/profile-bob.png` and `profile-alice.png` —
  big address header, monster-count badge, redesigned card grid.

Mobile 390x844:
- `screenshots/mobile/populated.png`, `leaderboard-empty.png`,
  `leaderboard-unavailable.png`, `monster-2-emberfox.png` — all
  fit, no horizontal overflow, header collapses to the bottom nav.

Axe-core (WCAG 2.0/2.1 A/AA) reports under
`docs/evidence/0021/test-results/axe-*.json`:
- 8 states × 0 serious/critical, 0 moderate.

## Test gates passed
- Contracts: 47 forge tests pass (`forge test -q`).
- Backend: `npm test` (9) + `tsc --noEmit` (incl. tests) + build.
- Frontend: `vitest run` (14) + `tsc --noEmit` + `next lint` +
  `next build` (9 routes).
- Local E2E: `scripts/local-e2e.sh` (fresh-Anvil two-wallet flow,
  assertions on leaderboard, restart idempotency).
- Browser evidence: `scripts/run-browser-evidence.sh` (10
  screenshots, 8 axe reports).
