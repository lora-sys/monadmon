# Decisions Log

Cross-cutting or time-bound decisions not large enough for an ADR.

## 2026-07-11 — Bootstrap
- **D-001** Chain target locked to **Monad testnet**. Confirmed by user via project brief.
- **D-002** `AGENTS.md` mirrors to `CLAUDE.md` for Claude-family tools.
- **D-003** License: **MIT**. Recorded in `LICENSE`.
- **D-004** All four ADRs resolved. See `docs/decisions/ADR-000{1..4}-*.md`.
- **D-005** No code committed during bootstrap. First commit is `913aae0` (scaffold only).
- **D-006** ISSUE-0003 split into 0003a (species.json author) and 0003b (Pollinations batch + manual cull) to keep PR scope tight.

## Re-verification needed at start of Phase 1
- **D-007** Pollinations.ai `flux` model still free + responsive. Run a 64×64 probe before kicking off ISSUE-0003b.
- **D-008** Monad testnet RPC URL + chain ID + faucet. Pin in `docs/architecture/monad.md`.

## 2026-07-12 — E2E milestone
- **D-007** Local Anvil (chain id 31337) is the canonical E2E environment for MonadMon MVP. CI testnet deploy comes after user provides a funded wallet.
- **D-008** Auto-select chain in wagmi config: `NEXT_PUBLIC_MONAD_RPC_URL` containing `localhost`/`127.0.0.1` → anvil; else → Monad testnet (10143).
- **D-009** Art is generated via Pollinations `flux`, hero images only for MVP (48 PNGs). DNA-variant grid is optional polish deferred to Phase 2.
- **D-010** PR review + self-merge is the established workflow in this single-maintainer autonomous context. Each PR posts the review-report + closes via squash merge with a documented self-merge note.
