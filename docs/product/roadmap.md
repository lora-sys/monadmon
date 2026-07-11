# Roadmap

Phased plan. Each phase has a verifiable exit.

## Phase 0 — Bootstrap (this session)
**Exit:** Harness ready, 3 ADRs decided, 12-Issue backlog live, repo committable.
- Status: **In Progress**

## Phase 1 — Core shell (≈ 3 issues)
- ISSUE-0001 — Foundry workspace init
- ISSUE-0002 — Next.js frontend init with wagmi/viem/RainbowKit
- ISSUE-0003 — Monster species catalog (12 species × 3 stages) — art + JSON
- Exit: `forge build` green; `pnpm dev` boots; species catalog served as `/data/species.json` with art under `public/assets/monsters/`.

## Phase 2 — Genesis Egg + Hatch
- ISSUE-0004 — `MonsterNFT.sol` (ERC-721 + speciesId/level/xp/dna/stats)
- ISSUE-0005 — `ItemNFT.sol` (ERC-1155 scaffold; no mint yet — Phase 2 only sets up the contract)
- ISSUE-0006 — `GenesisMinter.sol` + hatch with commit-reveal RNG
- ISSUE-0007 — Frontend: Landing → Mint → Hatch → See Monster
- Exit: Demo user mints and hatches on testnet. Screenshots at desktop+mobile.

## Phase 3 — Training + Monster detail
- ISSUE-0008 — Monster detail page
- ISSUE-0009 — Training page + cooldown UI
- Exit: User can train and see XP/ATK grow.

## Phase 4 — PvP + Leaderboard
- ISSUE-0010 — `Battle.sol` with type effectiveness
- ISSUE-0011 — Battle Arena UI
- ISSUE-0012 — Leaderboard
- Exit: Two-player PvP resolves on-chain; leaderboard updates.

## Phase 5 — Polish & demo
- ISSUE-0013 — Demo script + recording
- ISSUE-0014 — Landing-page polish, OG image
- ISSUE-0015 — Adversarial review sweep + bug bash
- Exit: 5-minute demo, zero Critical findings.

## Phase 6+ (out of MVP scope)
- Marketplace, items, exploration, guilds, fusion, seasons.
