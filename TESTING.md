# Testing Strategy & Evidence

## 1. Test pyramid
| Layer            | Tool              | Where                     |
|------------------|-------------------|---------------------------|
| Contract unit    | Forge             | `contracts/test/`         |
| Contract integ.  | Forge (fork)      | `contracts/test/integration/` |
| Frontend unit    | Vitest            | `frontend/**/*.test.ts`   |
| Frontend E2E     | Playwright        | `frontend/tests/e2e/`     |
| Indexer          | Vitest + fixtures | `backend/test/` (Phase 2+) |
| Visual smoke     | Playwright + screenshots | `docs/evidence/<id>/screenshots/` |

## 2. Contract testing
- Every external function has ≥ 1 happy-path + ≥ 1 revert-path test.
- Use fuzz tests (`forge-std`) for any function that takes user-controlled uints.
- For randomness: assert distribution over 10k fuzz runs (rarity bands).
- For PvP: golden-vector tests from `docs/design/battle-formula.md`.
- Coverage target: ≥ 90% line coverage on `contracts/src/`.

## 3. Frontend testing
- Unit: hooks (`useMonster`, `useBattle`, `useWallet`), pure helpers in `lib/`.
- Component: React Testing Library for any component with state or event logic.
- E2E (Playwright): connect wallet → mint egg → hatch → see monster. Must work on desktop Chrome and mobile Safari.
- Visual: capture screenshots on every E2E flow at desktop (1440×900) and mobile (390×844). Saved under `docs/evidence/<id>/screenshots/`.

## 4. Evidence format (per Issue)
```
docs/evidence/<issue-id>/
├── change-summary.md
├── implementation-plan.md
├── test-results/
│   ├── forge.txt
│   ├── vitest.txt
│   └── playwright.json
├── screenshots/
│   ├── desktop/
│   └── mobile/
├── review-report.md
└── verification.md     # human verification log
```

`change-summary.md` template lives in `templates/evidence-pack.md`.
`review-report.md` template lives in `templates/review-report.md`.

## 5. Coverage & bars
- Contracts: ≥ 90% line; 100% on any function that holds funds or mints.
- Frontend: ≥ 70% statements on touched files; 100% on hooks that compute monetary or rarity outcomes.
- E2E: ≥ 1 happy-path per page in MVP scope.
- A11y: axe-core scans on every public page; no `serious` or `critical` violations.

## 6. Failure investigation
- If a test fails: open a `bug` Issue before fixing. Don't paper over.
- For flake ≥ 2 consecutive runs, treat as a real defect.
- For Playwright flake, capture video + trace; file a `fix/<id>-flaky-<name>`.

## 7. References
- Templates: `templates/evidence-pack.md`, `templates/review-report.md`
- Checklists: `checklists/evidence-gate.md`, `checklists/pr-merge.md`
