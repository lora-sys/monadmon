# ADR-0003 — Frontend Stack

- Status: **Accepted** (proposed by Coordinator; user approval pending)
- Date: 2026-07-11
- Deciders: @user, @coordinator, @frontend

## Context
The web app is the surface most players will see. Stack choice drives everything from CI to onboarding speed.

## Decision
- **Next.js 14 (App Router)** + TypeScript strict + Tailwind CSS v3.
- **wagmi v2 + viem v2 + RainbowKit v2** for wallet/RPC.
- **framer-motion v11** for animation (hatch, level-up).
- **Vitest** for unit, **Playwright** for E2E.

## Why
- **Next.js** gives SSR for SEO (landing page), file-routing, and streaming RSC for fast first paint.
- **wagmi v2** is the de-facto React Web3 layer and works on Monad (pure EVM).
- **RainbowKit v2** has the best wallet picker UX out of the box.
- **Tailwind** keeps styling consistent with `docs/design/tokens.md`.
- **framer-motion** is the safest motion library for the hatch animation.

## Alternatives considered
- Vite + React Router (lighter, but loses SSR/SEO and streaming).
- ConnectKit (good but less feature-complete than RainbowKit).
- ethers.js (works, but viem is the future and wagmi v2 is viem-native).

## Consequences
- `frontend/app/`, `frontend/components/`, `frontend/lib/`, `frontend/hooks/`.
- CI runs `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm e2e`.
- Vercel for hosting (preview per PR, prod on `main`).

## References
- `docs/architecture/frontend.md`
- `docs/design/tokens.md`
- `docs/design/components.md`
