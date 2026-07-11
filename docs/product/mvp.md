# MonadMon — MVP

Narrow cut of the PRD. Each Acceptance Criterion is testable.

## In scope (must ship)

### F1 — Connect Wallet
- Player clicks "Connect Wallet"; RainbowKit modal opens; user selects a wallet on Monad testnet.
- After connect, header shows truncated address.
- **AC1.1** Connection persists across reloads (wagmi cookie/localStorage).
- **AC1.2** Network mismatch shows a one-click "Switch to Monad testnet" action.

### F2 — Genesis Egg Mint
- One Genesis Egg per wallet for MVP (anti-sybil cap).
- Mint is a single transaction to `MonsterNFT` (or a `GenesisMinter` helper).
- **AC2.1** Re-mint attempts revert with `AlreadyMinted()`.
- **AC2.2** After mint, the wallet holds exactly one `MonsterNFT` with `speciesId == 0` (egg stage), `level == 1`, `xp == 0`, `dna == 0`.

### F3 — Hatch
- Player triggers `hatch(tokenId)` on `MonsterNFT`.
- The contract derives a species + DNA from a commit-reveal RNG (ADR-0004).
- After hatch: `speciesId ∈ [1..12]`, `level == 1`, `xp == 0`, `dna != 0`.
- Frontend plays a 2–3 second hatch animation (framer-motion + sprite swap).
- **AC3.1** Rarity distribution over 10k fuzz runs is within ±5% of target (80/15/5 for Common/Rare/Legendary).
- **AC3.2** Same `commitHash` input deterministically produces the same species/DNA.

### F4 — Monster Detail
- Page `/monster/[id]` shows: large art, name (species + DNA suffix), type, level, XP bar, HP/ATK/DEF/SPD stats, DNA hex, evolution stage, action buttons (Train, Battle).
- **AC4.1** Stats rendered exactly match contract state.

### F5 — Training
- Player clicks "Train" → on-chain call to `train(tokenId)`.
- Cooldown: once per 6 hours per monster.
- Effects: `+30 XP`, `+2 ATK` (Phase 1 MVP). Cooldown enforced on-chain.
- **AC5.1** Training within cooldown reverts with `OnCooldown()`.
- **AC5.2** XP overflow into next level is allowed (no cap).

### F6 — PvP Battle
- Player A calls `challenge(tokenIdA, opponent, tokenIdB)`; on accept, `resolveBattle(tokenIdA, tokenIdB)` runs.
- Battle is deterministic from on-chain state and `prevrandao`.
- Winner gets `+50 XP`, `+1 Win`.
- **AC6.1** Same (playerA, playerB, prevrandao) yields same winner.
- **AC6.2** Type effectiveness matches `docs/design/battle-formula.md`.
- **AC6.3** Battle log emitted as event; indexable off-chain.

### F7 — Leaderboard
- Page `/leaderboard` lists top 100 by wins (ties broken by total XP).
- **AC7.1** Refresh ≤ 5s on testnet RPC.

### F8 — Showcase
- Page `/profile/[address]` is publicly readable; shows the wallet's monsters (one for MVP, but architected for many).

## Out of scope (deferred to Phase 2+)
- Monster Market / Trading.
- Items (ERC-1155) — Phase 2.
- Exploration.
- Guilds / Tournaments / Seasons.
- Monster Fusion.
- Token launch.

## Acceptance gate for MVP Done
- All AC1.x – AC8.x pass.
- Demo script runs in < 5 min on fresh wallet.
- Contracts ≥ 90% line coverage.
- Adversarial review (bug + architecture + ui + security) passes with zero Critical/High.
- Evidence packs complete for each Feature Issue.
