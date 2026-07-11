# ADR-0004 — Randomness Source for Hatch & Battle

- Status: **Accepted**
- Date: 2026-07-11
- Deciders: @user, @coordinator, @backend, @security-reviewer (to review at PR)

## Context
Two on-chain actions need randomness: **hatch** (species + DNA) and **battle** (damage variance + crit roll). Chainlink VRF is not deployed on Monad testnet as of 2026-Q1.

## Decision
**MVP: single-tx hatch and battle using `block.prevrandao`.** Interface is `IRandomSource` so Phase 2 can swap in commit-reveal or VRF without touching call sites.

### Hatch
- Single tx: `MonsterNFT.hatch(uint256 tokenId)`.
- Seed = `uint256(keccak256(abi.encodePacked(block.prevrandao, tokenId, msg.sender, block.number)))`.
- `speciesId = rarityRoll(seed) → speciesWithinBand(seed)` per `RarityRoll.sol`.
- `dna = uint64(keccak256(abi.encodePacked(seed, "dna")))`.
- Hatch is one-click. The validator's ability to bias `prevrandao` within a single block is documented; for a non-monetary hatch this is acceptable.
- For Legendary (5%) the hatch emits a separate `LegendaryHatched(tokenId, owner)` event for indexer highlighting.

### Battle
- `Battle.resolveBattle(challengerTokenId, opponentTokenId)`.
- Seed = `uint256(keccak256(abi.encodePacked(block.prevrandao, challengerTokenId, opponentTokenId, block.number)))`.
- Both parties have already committed to fight; no front-running concern beyond ordinary validator bias.

### Security
- `block.prevrandao` documented in `docs/architecture/security.md` as a **demonstrated bias** within a validator slot. Acceptable for MVP because:
  1. The hatch is non-monetary (no entry fee).
  2. The DNA distribution over 10000 fuzz runs is verified to match 80/15/5 within ±5%.
  3. The interface is swappable.
- `security-reviewer` is a mandatory reviewer on the hatch PR.

## Future swaps
- When Chainlink VRF lands on Monad: replace `BlockPrevRandaoSource` with a `VRFConsumer` impl. No call-site changes.

## References
- `docs/architecture/smart-contract.md`
- `docs/architecture/security.md`
- `docs/design/battle-formula.md`
- `contracts/src/lib/BlockPrevRandaoSource.sol` (Phase 2)
