# MonadMon — Product Requirements

## Goals
1. Ship a complete on-chain creature-raising loop on Monad testnet by demo day.
2. Make every Monster **truly owned** by the player (ERC-721 + on-chain state).
3. Make the Genesis Egg hatch feel **personal and memorable** — the moment of birth is the hook.
4. Make PvP **deterministic and verifiable** — anyone can replay a battle from chain data.
5. Make the system **safe for an early audience**: bounded supply, no paid mints in MVP, fair randomness.

## Non-Goals (MVP)
- No marketplace, no token launch, no guilds, no seasons.
- No multi-chain. Monad only.
- No mobile-native. Mobile web responsive only.
- No AI-art generator productized in MVP (see ADR-0001).
- No mainnet deploy. Testnet only.
- No complex 3D / Live2D models. 2D art only (see `docs/design/monster-system.md`).

## Users (personas)
1. **First-wave Monad adopter** — wants a personal keepsake from Monad's genesis.
2. **Pokémon fan** — drawn by creature collection, type chart, training.
3. **Existing on-chain gamer** — understands wallets, gas, and rarity; wants the strategic layer.

## Use Cases (MVP)
- UC-1: Connect wallet, mint a Genesis Egg, hatch it.
- UC-2: View Monster detail (species, level, stats, DNA, evolution).
- UC-3: Train a Monster (cooldown-gated; +EXP/ATK or +HP/DEF).
- UC-4: Challenge another player to a PvP battle and see a winner.
- UC-5: Climb the leaderboard by wins.
- UC-6: Showcase a Monster on a public profile.

## Success Metrics (MVP)
- ≥ 80% of minters complete the hatch within their first session.
- ≥ 30% of minters do at least one training.
- ≥ 10% of minters do at least one PvP battle.
- Demo script runs end-to-end on a fresh wallet in < 5 minutes.
- Zero Critical findings from security-reviewer on RNG or mint logic.

## Constraints
- Time: hackathon-style sprint. MVP must be demo-able, not exhaustive.
- Budget: zero paid image-gen or paid RPC unless explicitly approved.
- Tooling on dev machine: Node ≥ 20, pnpm/bun; **no Foundry pre-installed** (see ADR-0002).
- Chain: Monad testnet only.

## See also
- [mvp.md](mvp.md) — narrow MVP cut with ACs.
- [roadmap.md](roadmap.md) — phases.
- [feature-specs/](feature-specs/) — per-feature deep dive.
- [architecture/system.md](../architecture/system.md) — system overview.
- [design/monster-system.md](../design/monster-system.md) — the critical design.
