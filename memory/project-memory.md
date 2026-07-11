# Project Memory

Stable facts about MonadMon. Source of truth alongside `AGENTS.md` and `docs/`.

## Identity
- Name: **MonadMon** — "the first living creatures on Monad".
- Chain: **Monad** (EVM-compatible L1).
- Genre: On-chain creature-raising + PvP battle.
- Hook: "My first Monad creature, born on-chain, mine forever."
- License: **MIT**.

## Target users (MVP)
1. **Web3-curious Monad early adopters** — want to participate in Monad's launch with something personal.
2. **Pokémon-style game fans** — drawn by the creature-collection loop.
3. **Existing on-chain gamers** (Axie, Monsterra, Aavegotchi players).

## MVP top user outcome (one sentence)
A player can connect a wallet, mint a Genesis Egg, hatch it into a Monster, train it, and battle another player — all verifiable on Monad — within their first session.

## Hard non-goals (MVP)
- No marketplace / trading.
- No guilds.
- No tournaments or seasons.
- No mobile-native app (mobile web only).
- No mainnet deploy.
- No token launch / no $TOKEN.
- No bridge / no multi-chain.

## Constraint landscape
- Demo time budget: short (hackathon-style sprint).
- Dev machine (L0): Node ≥ 20, pnpm/bun available.
- **Budget: zero paid image-gen or paid RPC.** All art via Pollinations free tier.
- All randomness must be verifiable on Monad (no opaque oracles).

## Definition of Done (MVP)
1. A user can connect a wallet on Monad testnet and see their address.
2. They can mint a Genesis Egg (one per wallet for MVP).
3. They can hatch the egg and see a Monster with species, level, DNA, stats.
4. The Monster's image matches the species + stage.
5. They can train (cooldown-gated) and see level/XP go up.
6. They can challenge another player; the battle resolves via a deterministic formula and produces a winner on-chain.
7. A leaderboard ranks players by battles won.
8. Every flow is verified on Monad testnet with E2E screenshots.
9. Coverage ≥ 90% on contracts, ≥ 70% on touched FE.
10. Demo script works end-to-end on a fresh wallet in < 5 min.

## Aesthetic anchor
- "Living creature on a high-tech chain" — dark-mode default, neon-organic palette, soft motion, hand-crafted feel. NOT pixel-only, NOT generic Web3.

## Risks (tracked)
- See `PROJECT_STATUS.md` Risks section.
