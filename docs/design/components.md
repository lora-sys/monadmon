# Component Catalog

| Component          | Status   | Notes |
|--------------------|----------|-------|
| `Button`           | Approved | Primary / secondary / ghost / icon variants. |
| `Card`             | Approved | 8px radius, `--bg-1`, optional glow on hover. |
| `Header`           | Approved | Wallet button + nav. |
| `MonsterCard`      | WIP      | Art + name + level + rarity badge. |
| `StatBar`          | WIP      | HP/ATK/DEF/SPD horizontal bar with value. |
| `TypeBadge`        | Approved | Fire / Water / Nature / Electric pills. |
| `RarityBadge`      | Approved | Common / Rare / Legendary. |
| `TxToast`          | WIP      | Pending → success/error; aria-live. |
| `BattleReplay`     | Planned  | Phase 4. |
| `LeaderboardTable` | Planned  | Phase 4. |

All components live in `frontend/components/`. Each component has a `.stories.tsx` (Phase 2+) or a Playwright screenshot in its Evidence pack (MVP).
