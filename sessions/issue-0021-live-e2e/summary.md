# Session: ISSUE-0021 Live E2E Recovery — Closed

- GitHub Issue: #33
- Branch: `fix/33-live-e2e-rebuild`
- Worktree: `/home/lora/repos/monadmon-wt-33`
- Started: 2026-07-13
- Closed: 2026-07-14
- Coordinator: Codex
- Status: Ready for review (PR not yet opened)

## Outcome

- Recovery Issue (#33 / ISSUE-0021) moved from "Reopened MVP claim" to
  evidence-validated local E2E.
- Five cold-start reviewers (bug-hunter, behavior-reviewer,
  architecture-reviewer, security-reviewer, ui-reviewer) completed;
  the UI reviewer's C1 (DNA precision) and H1–H3 (contradictory
  evidence, missing axe/console, design-token drift) were remediated
  before the final evidence pack.
- Local E2E driver (`scripts/local-e2e.sh`) is now reproducible:
  fresh Anvil, two-wallet flow, on-chain receipt capture, leaderboard
  assertion, indexer restart idempotency.
- Browser evidence script (`scripts/run-browser-evidence.sh`)
  captures populated, empty, and unavailable leaderboard plus
  monster detail and both profiles at 1440x900 and 390x844, with
  axe-core injected and WCAG 2.0/2.1 A/AA reports written to
  `test-results/axe-*.json` (all zero violations).
- All CI gates (forge fmt + test, backend vitest + typecheck + build,
  frontend vitest + typecheck + lint + build) pass on the worktree.

## Open / Deferred

- #24 (Monad testnet deploy) — blocked on user-funded wallet;
  out of scope for this PR.
- `frontend/app/train/page.tsx` still uses raw `<img>` with an
  eslint-disable comment (L3 of the UI review). Tracked, non-blocking.
- `axe.run` returns a JSON-encoded string (axe result). Future work
  could parse it more strictly in the script for failure cases.

## Memory

Lessons captured in `memory/lessons.md` (2026-07-14 entry) cover
Solidity event indexed limits, viem block-timestamp handling, the
address-vs-token-id leaderboard footgun, live-Anvil E2E signal,
next/image JPEG-as-PNG, agent-browser session hygiene, axe-token-doc
coherence, and address normalisation at the storage boundary.
