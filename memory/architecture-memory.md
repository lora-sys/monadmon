# Architecture Memory

Approved patterns. Cite the ADR; don't restate it.

- **Contract stack:** Solidity ^0.8.24 + OpenZeppelin v5. Dev env decided per ADR-0002.
- **Wallet:** wagmi v2 + viem v2 + RainbowKit v2. Pure EVM stack — works on Monad without changes.
- **Frontend:** Next.js 14 App Router + TypeScript strict + Tailwind v3 + framer-motion v11.
- **RNG:** commit-reveal on `block.prevrandao` for MVP (see ADR-0004).
- **Storage of metadata:** IPFS via Pinata for tokens; SQLite for indexer (Phase 2+).
- **Testing:** Forge for contracts, Vitest + Playwright for FE.

Add new patterns here only when an ADR is approved.
