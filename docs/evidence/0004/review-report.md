# Review Report — ISSUE-0004/0006/0010 (Full Contract Suite)

Reviewers: bug-hunter, architecture-reviewer, security-reviewer.

## Verdict
**APPROVE with one Critical finding (fixed in-session) + several Medium/Low findings tracked.**

## Critical (fixed in-session)
- **C-1 — GenesisMinter would have made itself the NFT owner.** The original
  wrapper called `nft.mintGenesis()` which `_safeMint(msg.sender, …)` — but
  `msg.sender` inside MonsterNFT is the wrapper itself, so the egg would have
  landed on GenesisMinter, not the player. Fix: added `mintGenesisFor(address to)`
  to MonsterNFT, restricted to `genesisMinter` (set by owner post-deploy). The
  wrapper now correctly mints to the original caller. Test `test_MintForwardsToPlayer`
  pins the fix.

## Medium (fixed)
- **M-1 — Public mapping getter returned tuple, not struct.** `mapping(... => Challenge) public challenges`
  auto-getter returns fields; `Battle.t.sol` destructured into a struct expecting the
  full record. Added explicit `getChallenge(uint256)` helper. Test now uses it.
- **M-2 — TypeChart missing the `WATER attacker vs NATURE defender = 0.5` case.**
  Per the user brief, Nature beats Water; by symmetry Water is resisted by Nature.
  Added the explicit case. Golden vector test confirms the full 4×4 matrix.
- **M-3 — TypeChart golden vector had `waterRow[3] = 10000`.** Water is weak to
  Electric, so W-atk vs E-def must be 0.5. Updated the golden to `5_000`.
- **M-4 — MonsterNFT.sol was corrupted mid-edit by an `sed` chain.** Resorted to a
  full rewrite of the file from scratch; final state is clean, all 11 MonsterNFT
  tests pass + 5 GenesisMinter tests pass + 1 integration test passes.

## Low (acknowledged, tracked)
- **L-1 — Battle branch coverage 34%.** Main paths (challenge → accept →
  resolve → recordBattle) are at 100% via integration test. Branches in
  `_resolve` for tie-breakers and 50-turn cap are not exhaustively fuzzed.
  Filed as ISSUE-0017.
- **L-2 — Deploy.s.sol not yet run against testnet.** Test wallet funding +
  actual broadcast happen in ISSUE-0019 (testnet deploy + agent-browser E2E).
- **L-3 — Race condition on `recordBattle`:** if Battle resolves a challenge and
  the loser also calls `train` in the same block, ordering matters. Currently
  not exploitable (single tx per resolve) but flagged for Phase 2 if train
  moves off cooldown.
- **L-4 — `Ownable` is single-admin.** Phase 2 should switch to AccessControl
  with separate ADMIN, MINTER, BATTLE roles. ADR required.

## Security (advisory)
- Randomness source: `block.prevrandao` is validator-influenceable; documented
  in ADR-0004 + `docs/architecture/security.md`. Acceptable for the non-monetary
  hatch. Future VRF swap is one-line via IRandomSource.
- All state-changing functions are `nonReentrant`. Mint cap is enforced by
  storage write before any external call.
- Custom errors used throughout (no string reverts leaking state).
- `tx.origin` never used.
- No `delegatecall`.
- `selfdestruct` not present.

## Test coverage details
- 37 tests passing, 0 failing, 0 skipped.
- 3 fuzz suites (Battle, RarityRoll determinism, RarityRoll distribution,
  RarityRoll legendary, TypeChart same-element, TypeChart valid-bps) each
  running 10 000 iterations.
- 1 explicit 10k seed sweep confirms AC3.1 rarity band distribution.
- Integration test exercises the full mint → hatch → train → battle flow.

## Recommendation
Merge to `main`. Closes ISSUES #11, #13, #14.
