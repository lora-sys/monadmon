# ADR-0004 — Randomness Source for Hatch & Battle

- Status: **Proposed — pending user decision**
- Date: 2026-07-11
- Deciders: @user, @coordinator, @backend, @security-reviewer

## Context
Two on-chain actions need randomness:
1. **Hatch** — picks species rarity band, then species within band, then derives DNA seed.
2. **Battle** — derives `seed` for damage variance / crit rolls.

Constraints:
- Chainlink VRF is **not deployed on Monad testnet** as of 2026-Q1.
- We need the simplest verifiable RNG we can ship.

## Options

### Option A — Commit-reveal on `block.prevrandao` (recommended)
- Player calls `commitHatch(tokenId, commitHash)` where `commitHash = keccak256(seed, secret)`.
- Later (same or next block), anyone (or the player) calls `revealHatch(tokenId, seed, secret)` which checks `keccak256(seed, secret) == commitHash` and uses `seed XOR block.prevrandao` as the entropy source.
- For MVP we may collapse to a single tx: `hatch(tokenId)` where `secret = block.prevrandao` revealed in-callback. We document the front-running window and decide later.
- **Pros:** no external deps; works on any EVM; auditable.
- **Cons:** `block.prevrandao` is influenced by the validator; sophisticated MEV attackers can influence the outcome within a small bias window (well-studied; see `security.md`).

### Option B — Chainlink VRF (when available)
- Use `VRFConsumerBaseV2` via a subscription. Strongest security.
- **Cons:** not on Monad testnet today. Defer.

### Option C — Off-chain signed oracle
- A trusted keeper signs `seed = keccak256(nonce, serverSecret)`. On-chain verifies signature.
- **Pros:** strong randomness, no on-chain bias.
- **Cons:** trust assumption on the oracle; MVP doesn't have a backend.

## Decision
**TBD — awaiting user decision.**

Coordinator recommendation: **Option A** for MVP. We use `block.prevrandao` directly for the hatch and battle RNG. Document the bias risk in `docs/architecture/security.md`. Keep the surface behind `IRandomSource` so Phase 2 can swap to Option B when VRF lands on Monad.

## Concrete spec (Option A)
```solidity
interface IRandomSource {
    function requestSeed(bytes32 salt) external returns (bytes32 requestId);
    function fulfillSeed(bytes32 requestId) external returns (uint256 seed);
}
```

MVP impl:
- `commitHatch(tokenId, salt)` — stores `commitHash = keccak256(salt)` and marks the egg as committed.
- `revealHatch(tokenId, salt)` — checks hash, derives `seed = uint256(keccak256(abi.encodePacked(salt, block.prevrandao, tokenId)))`, rolls rarity → species → DNA.
- For UX simplicity, MVP exposes `hatch(tokenId)` that auto-commits-and-reveals in one call (the front-running window is acceptable for a non-monetary hatch).

For battle, the seed is `block.prevrandao` at the `resolveBattle` block — no commit needed since both parties have already agreed to fight.

## Consequences
- `contracts/src/lib/CommitRevealRandomSource.sol` (Option A).
- `security-reviewer` mandatory on the hatch PR.
- Bias window documented in `docs/architecture/security.md`.

## References
- `docs/architecture/smart-contract.md`
- `docs/architecture/security.md`
- `docs/design/battle-formula.md`
