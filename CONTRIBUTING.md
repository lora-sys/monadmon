# Contributing to MonadMon

## The deal
MonadMon is built issue-first, PR-only, evidence-gated. Anyone — human or AI agent — touches code via an Issue and a PR. No exceptions.

## 1. Pick or open an Issue
- Browse `PROJECT_STATUS.md` (Now / Backlog).
- Comment to claim an Issue, or open a new one from `.github/ISSUE_TEMPLATE/`.
- Use the right template: `feature`, `bug`, `refactor`, `spike`.
- Every Issue needs: Spec Reference (to `docs/`), Acceptance Criteria, Estimate, Owner, Reviewers.

## 2. Create a branch in a worktree
```
git fetch origin
git worktree add ../monadmon-<id>-<slug> -b feature/<id>-<slug> origin/main
cd ../monadmon-<id>-<slug>
```
One Worktree per agent/owner. Never edit on `main`.

## 3. Implement
- Keep the change scoped to the Issue. No drive-by edits.
- Tests first or tests alongside — never after the fact.
- Follow `ENGINEERING.md` (style, API rules, forbidden list).
- Use the linked `docs/evidence/<id>/implementation-plan.md` if one exists.

## 4. Self-test before opening PR
- Contracts: `forge test` → green.
- Frontend: `pnpm test` → green; `pnpm e2e` on touched flows.
- Capture evidence into `docs/evidence/<id>/`.

## 5. Open a PR
Use `.github/PULL_REQUEST_TEMPLATE.md`. Required sections:
- Linked Issue
- Change Summary (1–3 bullets)
- Evidence checklist (all ticked)
- Risk & rollback
- Reviewer requests

## 6. Review
- 2 cold-start reviewers minimum. Address every `severity: critical|high`.
- Use `docs/evidence/<id>/review-report.md` as the report format.

## 7. Merge
- Squash. CI green. Evidence complete. Required reviewers approved.
- If schema/auth/migration/randomness changed → human approval required.

## 8. After merge
- Coordinator updates `PROJECT_STATUS.md`.
- `docs/.index/freshness.json` regenerates.
- Memory files updated if a stable lesson emerged.
