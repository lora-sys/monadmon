# Change Summary — ISSUE-0001 (Foundry workspace init)

## What
Initializes the Foundry workspace under `contracts/`. Establishes the chain
configuration for Monad testnet (chain id 10143) and local anvil (31337),
installs OpenZeppelin v5.1.0 as the contracts dependency, and ships a
placeholder `MonsterNFT.sol` that locks the per-token storage layout used by
every later contract issue.

## Why
- Subsequent contract work (MonsterNFT full impl, GenesisMinter, Battle,
  tests) needs a working `forge build` / `forge test` loop.
- The storage struct and its packing are decided once here, so future PRs
  extend by appending fields rather than re-ordering. The struct fits in 2
  storage slots per token (96 bits used in slot 1, 20 bytes free for future
  fields).

## Files
- `contracts/foundry.toml` — Solc 0.8.24, optimizer 200, fuzz 10k, gas
  reports, monad_testnet + anvil RPCs.
- `contracts/remappings.txt` — forge-std, OpenZeppelin.
- `contracts/.env.example` — MONAD_TESTNET_RPC, ANVIL_RPC, DEPLOYER_PRIVATE_KEY,
  PINATA_API_KEY, PINATA_SECRET.
- `contracts/src/MonsterNFT.sol` — Placeholder contract declaring the packed
  `Monster` struct, a private `_monsters` mapping, a public `getMonster`
  getter, and a `monsterSlot` helper.
- `contracts/test/MonsterNFT.t.sol` — 4 passing tests: name/symbol, zero
  struct, storage round-trip (write + read every field via vm.store), slot
  helper.
- `contracts/script/Deploy.s.sol` — Skeleton deploy script reading
  `DEPLOYER_PRIVATE_KEY`.

## Acceptance Criteria check
- [x] foundry.toml configured for Monad testnet (10143) + anvil.
- [x] placeholder MonsterNFT.sol compiles.
- [x] 4 passing tests (name/symbol, zero struct, round-trip, slot helper).
- [x] Deploy.s.sol skeleton.
- [x] forge fmt --check / forge build / forge test all green.
- [x] .env.example added.

## Adversarial review summary
Three reviewer personas reviewed this PR (see `docs/evidence/0001/review-report.md`).
Critical finding: the original `monsters(uint256)` `pure` function shadowed the
public mapping slot that ISSUE-0004 needs. Fixed by switching to a private
`_monsters` mapping with an explicit `getMonster(uint256)` struct getter.
Medium finding: slot-count comment was wrong (it's 2 slots, not 6). Fixed.
Round-trip test added to prevent future packing regressions.

## Not in scope (later issues)
- Real ERC-721 inheritance + mint/burn (ISSUE-0004).
- Hatch + GenesisMinter + IRandomSource (ISSUE-0006).
- Battle + TypeChart (ISSUE-0010).
- CI workflow (planned ISSUE-0016).
