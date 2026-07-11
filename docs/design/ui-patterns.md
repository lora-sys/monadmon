# UI Patterns

## Loading
- Skeleton blocks for monster art and stats. Never spinners on art (use shimmer).

## Empty
- "You don't have a Monster yet. Mint your Genesis Egg to begin." with a CTA.

## Error
- Surface custom error names: `AlreadyMinted`, `OnCooldown`, etc., via a `humanizeError()` helper.
- Always show a "Retry" action when relevant.

## Forms / Inputs
- Address inputs accept ENS / monadens (if supported). Default to pasting.

## Wallet
- RainbowKit modal. Triggers from header only.
- Wrong-network state: full-bleed banner + "Switch to Monad testnet" CTA.

## Confirmation flows
- Hatch → 2400ms animation, then auto-redirect to monster detail.
- Train → optimistic UI + revert handling.
- Battle → "Challenge sent" toast; opponent accepts → battle screen.
