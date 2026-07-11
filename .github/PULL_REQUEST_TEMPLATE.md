## Linked Issue
- Closes #<id>

## Change Summary
- <bullet>
- <bullet>

## Evidence Checklist
- [ ] `forge test` green — log: `docs/evidence/<id>/test-results/forge.txt`
- [ ] `pnpm test` green — log: `docs/evidence/<id>/test-results/vitest.txt`
- [ ] Playwright run on touched flows — `docs/evidence/<id>/test-results/playwright.json`
- [ ] Screenshots (desktop + mobile) — `docs/evidence/<id>/screenshots/`
- [ ] `change-summary.md` written
- [ ] `implementation-plan.md` followed (or amended in PR body)

## Risk & Rollback
- Reversible? How?
- If irreversible (mint authority, RNG, schema): Human Approval Gate requested.

## Reviewers
- bug-hunter — ✅/❌
- architecture-reviewer — ✅/❌
- ui-reviewer (if UI) — ✅/❌
- security-reviewer (if auth/randomness/payment) — ✅/❌

## Notes
- ADR refs: ADR-NNNN
