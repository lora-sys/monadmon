# Frontend Architecture

## Stack
- Next.js 14 (App Router), TypeScript strict, Tailwind v3, framer-motion v11.
- wagmi v2 + viem v2 + RainbowKit v2.
- Zustand for tiny local UI state (wallet-derivable state lives in wagmi hooks).
- Vitest + Playwright.

## Routes (MVP)
```
/                              # Landing
/connect                       # Wallet connect screen (mostly a stub; wallet picker lives in header)
/mint                          # Mint Genesis Egg
/monster/[tokenId]             # Monster detail
/train                         # Training page (lists monsters you own)
/arena                         # Battle lobby
/arena/[battleId]              # Battle playback
/leaderboard                   # Top 100 by wins
/profile/[address]             # Public showcase
```

## Layout
- App Router. Server Components by default. `"use client"` only on pages with wallet interactions.
- Header: wallet button (RainbowKit) + nav links.
- Footer: chain indicator, "MonadMon · testnet" badge.

## Wallet hooks (typed wrappers)
- `useMonster(tokenId)` — reads `monsters(tokenId)`, derives display name from species + DNA.
- `useOwnedMonsters(address)` — reads `balanceOf` + enumerable, returns list of tokenIds.
- `useTrainCooldown(tokenId)` — derives `canTrain` from `lastTrainedAt + 6h`.
- `useBattle(battleId)` — reads battle struct and events for replay.
- `useLeaderboard(topN)` — calls indexer endpoint (Phase 2) or RPC scans (MVP).

## Error handling
- Every tx call wraps in `useWriteContract` + `useWaitForTransactionReceipt`.
- Decode custom errors via wagmi `decodeErrorResult` + a human-friendly error map (matches `docs/architecture/smart-contract.md`).
- Toast component (lucide icons + framer fade).

## Performance
- App Router streaming. Suspense around wallet reads.
- Static species catalog at build time (`public/data/species.json`).
- Image optimization via `next/image` for monster art.
- No client-side `window` access without `'use client'`.

## Styling
- Dark mode default. CSS variables in `globals.css`. Tailwind tokens aligned with `docs/design/tokens.md`.
- Components in `frontend/components/` follow `docs/design/components.md`.

## Testing
- Unit (Vitest): hooks, helpers, error maps.
- Component (RTL): buttons, monster card.
- E2E (Playwright): mint → hatch → train → battle (Phase 4). Visual screenshots per route.

## Accessibility
- Color contrast ≥ 4.5:1.
- Keyboard navigable. Focus rings visible.
- aria-live for tx status toasts.
