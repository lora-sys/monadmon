# MonadMon — Agent Operating Contract (L0)

> Source of truth for every AI agent acting on this repo. Mirrored at `CLAUDE.md` for Claude-family tools. Read this first; do not invent.

## 1. What this project is
MonadMon — an on-chain creature-raising and PvP battle game deployed on **Monad** (EVM-compatible L1).
Each player connects a wallet, mints a **Genesis Egg**, hatches it into a **Monster** bound to an ERC-721 with stats, DNA, and evolution history. Players train, explore, battle other players, and climb a leaderboard. The vibe is "the first living creatures on Monad" — characters are precious, scarce, and truly owned.

## 2. Operating principles
1. **Human owns vision and boundaries.** AI owns implementation, review, evidence.
2. **Issues are the unit of work.** No code change without an Issue. No merge without two Reviewer reports + Evidence.
3. **Worktrees isolate agents.** Do not edit `main` directly. One Worktree per agent.
4. **Adversarial review is non-negotiable.** Assume every PR has a bug — find it.
5. **Evidence gates every transition.** Frontend screenshots + browser console, contract tests + traces, schema diffs, Reviewer reports. No evidence → not done.
6. **Documentation is the contract.** `AGENTS.md`, `DESIGN.md`, `ENGINEERING.md`, `TESTING.md`, `CONTRIBUTING.md`, `PROJECT_STATUS.md`, plus `docs/` and `memory/`.
7. **Memory is project state, not chat.** Stable conclusions live in `docs/` and `memory/`. Chat reasoning is ephemeral.

## 3. Repo map (L0)
```
AGENTS.md, CLAUDE.md          — this file (mirrored)
DESIGN.md                     — brand, tokens, UI patterns, monster system
ENGINEERING.md                — frontend/backend/contract/db/git/review rules
TESTING.md                    — test strategy, evidence format
CONTRIBUTING.md               — how to propose changes (Issue-first)
PROJECT_STATUS.md             — live kanban
docs/INDEX.md                 — master index of every doc
docs/product/{prd,mvp,roadmap,user-stories}.md, docs/product/feature-specs/*.md
docs/architecture/{system,frontend,backend,smart-contract,monad,security,deploy,glossary}.md
docs/design/{brand,tokens,components,motion,ui-patterns,monster-system}.md
docs/decisions/ADR-*.md       — one file per decision
docs/evidence/<issue>/        — change-summary.md, test-results/, screenshots/, review-report.md
docs/sessions/                — per-session logs of multi-agent runs
memory/                       — project-memory, architecture-memory, decisions, lessons
contracts/                    — Solidity (Foundry or Hardhat — see ADR-0002)
frontend/                     — web app (Next.js — see ADR-0003)
backend/                      — optional indexer/API (Phase 2+)
scripts/                      — bash helpers
skills/                       — project-local skills
```

## 4. Hard constraints
- **Never** edit `main`/`master` directly. Always via PR from a feature branch in a worktree.
- **Never** commit secrets, mnemonics, RPC URLs with keys, or wallet files. Use `.env` (gitignored).
- **Never** write business code without an Issue reference in the PR body.
- **Never** skip Reviewer reports. The minimum for any PR: `bug-hunter` + `architecture-reviewer`. Add `ui-reviewer` for any visible UI change; `security-reviewer` for any auth/payment/randomness change.
- **Never** merge a PR without Evidence in `docs/evidence/<id>/`.
- **Never** use `git reset --hard`, `git checkout --`, or `git clean -fd` without explicit human approval.

## 5. Forbidden actions (L0)
- Force-push to `main`/`master`.
- Bypass the harness via raw shell edits outside the PR flow.
- Skip CI to merge.
- Touch files outside your allow-list in an Issue.
- Auto-resolve multi-agent conflicts.

## 6. Stack snapshot (see ENGINEERING.md for detail)
- **Chain:** Monad testnet (EVM-compatible). RPC: `https://testnet-rpc.monad.xyz`. Chain ID: see `docs/architecture/monad.md`.
- **Contracts:** Solidity ^0.8.24, OpenZeppelin v5, Foundry or Hardhat (decided in ADR-0002).
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind + viem + RainbowKit/Reown AppKit.
- **Wallet UX:** RainbowKit v2 + wagmi v2 + viem v2 (preferred) — `wagmi` covers Monad because it's plain EVM.
- **RNG:** commit-reveal using `block.prevrandao` on Monad (no Chainlink VRF on testnet as of 2026-Q1) — see ADR-0004.
- **Storage of metadata:** off-chain JSON on IPFS (Pinata) or self-hosted, referenced by `tokenURI`. Spec lives at `docs/architecture/storage.md`.
- **Art:** TBD — see ADR-0001 (12 species × 3 stages, generation method under discussion).

## 7. Issue workflow
1. Pick or create an Issue. Read it. Read linked docs.
2. Branch: `feature/<id>-<kebab-slug>` in a worktree.
3. Implement with tests + Evidence.
4. Self-test. Fix. Commit (`type(scope): summary, refs #<id>`).
5. Open PR using `.github/PULL_REQUEST_TEMPLATE.md`.
6. Wait for 2+ Reviewer reports. Address every Critical/High.
7. Merge when CI green + Evidence complete + human approval (if required).

## 8. Decision policy
- Trivial → decide inline, mention in `memory/decisions.md`.
- Architectural → open an ADR in `docs/decisions/ADR-NNNN-<slug>.md` using `templates/adr.md`. Cite the ADR in any code or PR that depends on it.
- Reversible → prefer cheap over clever.
- Irreversible (token supply, mint authority, upgradeability, signature verifier) → **Human Approval Gate** before merge.

## 9. Communication
- `commentary` channel: brief progress notes while working.
- `final` channel: short prose close-out. Reference file paths as `[file.ts:42](file.ts)`.
- No emojis. No em dashes. No cheerleading.
- When a finding matters more than a sentence, lead with the finding.

## 10. Where to ask for help
- Stuck on design → check `docs/INDEX.md`, then ADR log, then `memory/`.
- Stuck on implementation → check the linked Issue + `docs/architecture/`.
- Stuck on a library → check `docs/decisions/` and `memory/architecture-memory.md` before recommending a new dep.
