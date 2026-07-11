# Engineering Rules

How we build MonadMon. Updated by Coordinators after each ADR. Read alongside `AGENTS.md`.

## 1. Languages & toolchains
| Layer            | Choice                          | ADR   |
|------------------|---------------------------------|-------|
| Contracts        | Solidity ^0.8.24                | 0002  |
| Contracts deps   | OpenZeppelin v5, forge-std      | 0002  |
| Contracts test   | Foundry (forge)                 | 0002  |
| Frontend lang    | TypeScript strict               | 0003  |
| Frontend runtime | Node ≥ 20, pnpm                 | 0003  |
| Frontend framework | Next.js 14 (App Router)      | 0003  |
| Styling          | Tailwind CSS v3 + CSS variables | 0003  |
| Web3 client      | viem v2 + wagmi v2              | 0003  |
| Wallet UX        | RainbowKit v2 (wagmi adapter)   | 0003  |
| Animations       | framer-motion v11               | 0005  |
| Tests (FE)       | Vitest + Playwright             | 0003  |
| Lint (FE)        | ESLint v9 (flat) + Prettier     | 0003  |
| Off-chain store  | IPFS via Pinata; SQLite for indexer | 0006  |
| Art generation   | Pollinations.ai (`flux`), zero API key, batch via `scripts/generate-monsters.mjs` | 0001 |

## 2. Folder rules
- `contracts/src/` — Solidity. One file per contract. Library in `contracts/src/lib/`.
- `contracts/test/` — Foundry tests. Mirror `src/` paths.
- `contracts/script/` — Forge deploy scripts.
- `frontend/app/` — Next.js App Router pages.
- `frontend/components/` — feature-scoped components; one folder per feature.
- `frontend/lib/` — pure TS (no React). `viem`, math, types.
- `frontend/hooks/` — React hooks.
- `frontend/public/assets/monsters/` — generated monster art (per `docs/design/monster-system.md`).
- `frontend/public/data/species.json` — canonical 12-species catalog. Source of truth for art + base stats.
- `backend/` — Phase 2+ indexer in TypeScript (viem + SQLite + better-sqlite3).
- `scripts/` — Node 20 helpers, no third-party deps unless approved by an ADR.

## 3. Git rules
- Default branch: `main`. Protected.
- Branch naming: `feature/<id>-<slug>`, `fix/<id>-<slug>`, `spike/<id>-<slug>`.
- Commit subject ≤ 50 chars. Body ≤ 72 cols. Conventional Commits. Footer refs Issue.
- One PR = one Issue. No drive-by refactors.
- Squash merge. Commit message body becomes the PR's "what changed".
- Rebase before merge; no merge commits in feature branches.

## 4. Code style
- **TypeScript:** strict, `noUncheckedIndexedAccess: true`, no `any` outside typed 3rd-party shims.
- **Solidity:** explicit visibility on every state/function. Use `custom errors`. Natspec on every external/public function.
- **Components:** React Server Components by default; mark `"use client"` only when needed. Co-locate styles.
- **No dead code, no commented-out code, no `TODO` without an Issue link.**
- Comments only where code is not self-explanatory. Prefer self-naming.

## 5. API & contract design
- Solidity: keep contracts small and composable. Inherit interfaces, not implementations, where possible.
- All external functions `revert CustomError()` — no string reverts.
- All token mint/burn restricted by `Ownable2Step` (OZ v5). Phase 2 may move to `AccessControl`.
- All randomness via `IRandomSource` interface; concrete impl = `BlockPrevRandaoSource` for MVP (ADR-0004).
- Frontend reads via viem; never instantiates raw RPC.

## 6. Review rules
- 2 cold-start Reviewers minimum on every PR: `bug-hunter` + `architecture-reviewer`.
- `ui-reviewer` is **mandatory** for any change to `frontend/app/**` or `frontend/components/**`.
- `security-reviewer` is **mandatory** for changes touching auth, randomness, payments, mint authority, signature verification, or upgradeability.
- Reviewer reports go to `docs/evidence/<id>/review-report.md`.
- A PR cannot merge with any open `severity: critical|high` review finding.

## 7. Forbidden in code
- `selfdestruct` (deprecated on Monad regardless).
- `tx.origin` for auth.
- Unchecked low-level calls.
- `delegatecall` outside the upgradeability proxy (Phase 2+).
- Floating-promises in TS.
- Magic numbers without a named constant.

## 8. Tooling defaults
- `pnpm` for FE, `forge` for contracts.
- `direnv`-style `.env.local` for secrets. Never commit.
- `lefthook` pre-commit: prettier + forge fmt on staged files (Phase 1+).

## 9. Deploy
- Testnet only for MVP. Mainnet after audit (out of scope for MVP).
- Deploy via `forge script script/Deploy.s.sol --rpc-url $MONAD_TESTNET_RPC --broadcast`.
- Frontend deployed to Vercel (project default).

## 10. References
- Decisions: `docs/decisions/ADR-*.md`
- Plan template: `docs/evidence/<id>/implementation-plan.md`
- Issue templates: `.github/ISSUE_TEMPLATE/`
- Review checklist: `docs/evidence/<id>/review-report.md`
