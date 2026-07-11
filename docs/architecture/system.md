# System Architecture

High-level shape. Details in sub-documents.

```
┌──────────────────┐        ┌──────────────────┐
│  Next.js 14 (FE) │◀──────▶│ Monad testnet RPC│
│  + wagmi + viem  │        │ (viem transport) │
│  + RainbowKit    │        └────────┬─────────┘
└────────┬─────────┘                 │ JSON-RPC
         │  reads                    ▼
         │                  ┌──────────────────┐
         │                  │ Smart contracts  │
         │                  │ - MonsterNFT     │
         │                  │ - ItemNFT        │
         │                  │ - GenesisMinter  │
         │                  │ - Battle         │
         │                  │ - RandomSource   │
         │                  └────────┬─────────┘
         │                           │ events
         ▼                           ▼
┌──────────────────┐        ┌──────────────────┐
│ Pinata / IPFS    │        │ Indexer (Phase2) │
│ tokenURI JSON    │        │ SQLite + REST    │
│ species art      │        └──────────────────┘
└──────────────────┘
```

## Boundaries
- **Smart contracts** own all game state and randomness.
- **Frontend** is a stateless view layer. No business logic beyond pure helpers.
- **IPFS** holds tokenURI JSON and species art (see `storage.md`).
- **Indexer** (Phase 2) materializes views for leaderboards, profile pages, battle replays.

## Data flow (MVP)
1. Player connects wallet → FE reads chainId, switches to Monad testnet if needed.
2. Player clicks Mint → FE sends `mintGenesis()` tx via wagmi → contract emits `EggMinted(wallet, tokenId)`.
3. Player clicks Hatch → FE calls `commitHatch(tokenId, commitHash)` → later `revealHatch(tokenId, seed)`. Or single-call convenience `hatch(tokenId)` if commit-reveal fits in one tx.
4. Player clicks Train → FE calls `train(tokenId)` → contract validates cooldown, applies stat deltas, emits `Trained(tokenId, newXp, newAtk)`.
5. Player clicks Challenge → FE calls `challenge(opponent, myTokenId, oppTokenId)` → opponent accepts → `resolveBattle(...)` emits `BattleResolved(winner, loser, seed)`.

## Cross-cutting concerns
- **Auth:** wallet signature only. No backend accounts.
- **Randomness:** `block.prevrandao` (post-merge EVM) used via `IRandomSource` interface.
- **Time:** `block.timestamp` for cooldowns. Drift tolerance: ±60 s documented.
- **Gas:** Every on-chain action tuned to fit Monad gas profile (target < 200k gas).
- **Reorg safety:** Indexer waits N confirmations before persisting.

## Failure modes
- **RPC down:** FE shows "Monad RPC unreachable, retry".
- **User on wrong network:** "Switch to Monad testnet" CTA.
- **Tx reverted:** surface the custom error name (`AlreadyMinted`, `OnCooldown`, …) with a human-friendly map.
