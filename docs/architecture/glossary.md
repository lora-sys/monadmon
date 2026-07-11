# Glossary

| Term                | Meaning |
|---------------------|---------|
| Monster             | A player's creature. ERC-721 token. |
| Genesis Egg         | Pre-hatch state. `speciesId == 0`. |
| Species             | One of 12 fixed monster kinds (e.g. EmberFox). |
| Stage               | Evolution stage within a species (0/1/2). |
| DNA                 | 64-bit individual trait hash, derived at hatch. |
| Rarity              | Common / Rare / Legendary (80/15/5 target). |
| Element             | Fire / Water / Nature / Electric. |
| Type Chart          | Effectiveness matrix; see `design/battle-formula.md`. |
| Hatch               | Transition Egg → Monster. Reveals species + DNA + stats. |
| Train               | +XP / +ATK action, cooldown-gated. |
| Battle              | PvP between two Monsters. Deterministic from on-chain state + seed. |
| Leaderboard         | Top wallets by battles won. |
| Showcase / Profile  | Public page listing a wallet's monsters. |
| RNG                 | Randomness. MVP = commit-reveal on `block.prevrandao` (ADR-0004). |
| Season              | Time-bound competition. Out of MVP scope. |
| Guild               | Player group. Out of MVP scope. |
| Items               | ERC-1155 (stones, candies). Out of MVP scope. |
