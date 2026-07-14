# Implementation Plan: ISSUE-0021

GitHub Issue: #33

## Goal

Make the local data path reproducible and truthful:

`Anvil logs -> viem decode -> SQLite -> Hono API -> Next.js UI`

## Work Plan

1. Add backend test infrastructure and fixtures around the actual Solidity
   event shape. Export a bounded range-indexing seam so event replay can be
   tested without timers.
2. Align the backend ABI and log query with `Battle.sol`. Decode token IDs from
   event data through viem instead of manually slicing bytes.
3. Map winner and loser token IDs to challenge participants, fetch real block
   timestamps, await monster synchronization, and make replay idempotent.
4. Test leaderboard ordering, API validation, historical replay from a fresh
   database, and restart from an indexed checkpoint.
5. Replace leaderboard demo data with a typed React Query client and explicit
   loading, populated, empty, and unavailable states. Correct monster asset
   resolution and use `next/image` for committed art.
6. Add deterministic local E2E orchestration for fresh Anvil deployment and a
   two-wallet mint, hatch, train, challenge, and resolution flow.
7. Run contract/backend/frontend checks, then start the full local stack and
   validate API responses and rendered pages with `agent-browser` at 1440x900
   and 390x844. Capture console and accessibility evidence.
8. Run cold-start bug, behavior, architecture, security, and UI reviews.
   Aggregate findings and repeat implementation/test/review until no Critical
   or High finding remains.
9. Complete the evidence pack, update project/session/memory truthfully, open
   the PR, and hold merge until GitHub CI is green.

## Test Matrix

| Surface | Automated proof |
|---|---|
| Solidity event contract | Forge event assertion and real Anvil receipt |
| ABI and range indexing | Vitest fixture + Anvil historical replay |
| Resolution mapping | Vitest participant/token permutations |
| Idempotency | Replay and restart database assertions |
| Leaderboard/API | SQLite query tests + Hono request tests |
| Frontend states | Component/page tests where practical + live browser states |
| Full user path | Fresh Anvil two-wallet E2E trace |
| Visual/runtime | Desktop/mobile screenshots, console, axe |

## Rollback

The change is local-only and has no schema migration. Reverting the PR restores
the previous indexer and static page. E2E databases and Anvil state are
temporary artifacts and can be deleted without user-data loss.
