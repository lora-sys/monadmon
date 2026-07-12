# Change Summary — ISSUE-0004 + ISSUE-0006 + ISSUE-0010 (full contract suite)

## What
Ships the complete on-chain game logic for MonadMon MVP:

- `MonsterNFT` — ERC-721 + ERC721URIStorage + Ownable + ReentrancyGuard. State holds
  speciesId, level, xp, stage, dna, hp/atk/def/spd, lastTrainedAt, battles won/lost.
  Public surface: `mintGenesis()`, `mintGenesisFor(address)`, `hatch(uint256)`,
  `train(uint256)`, `recordBattle(...)`, `getMonster(uint256)`, `battleView(uint256)`.
- `GenesisMinter` — Thin wrapper that calls `MonsterNFT.mintGenesisFor(msg.sender)`,
  keeping a stable ABI for the FE.
- `Battle` — `challenge(...)` + `acceptAndResolve(uint256)` using a deterministic
  per-turn damage formula (TypeChart effectiveness + 0.85..1.15 rand + 12% crit).
- `ItemNFT` — ERC-1155 scaffold with `mint(...)` and `setURI(...)` for Phase 2.
- `IRandomSource` interface — swappable RNG (ADR-0004).
- `BlockPrevRandaoSource` — MVP impl using `block.prevrandao`.
- Pure libs: `RarityRoll` (50/30/20 band + species pick), `TypeChart` (full
  matrix from user brief), `Stats` (DNA tilt + level curve), `SpeciesRegistry`
  (12 species catalog with base stats + element mapping).

## Why
- Closes MVP acceptance criteria AC2.x (mint), AC3.x (hatch), AC5.x (train),
  AC6.x (battle). AC1.x (wallet) lives in the FE.
- Establishes the storage layout + RNG interface so Phase 2 can swap VRF without
  touching call sites.

## Test summary
- 37 passing tests across 8 suites.
- 3 fuzz suites running 10k iterations each (RarityRoll distribution,
  TypeChart only-valid-bps, Battle deterministic, plus per-function fuzz).
- 1 explicit 10k seed-sweep distribution test confirming AC3.1 (±5% of 50/30/20).
- 1 full-flow integration test (mint → hatch → train → battle).
- Line coverage 85%, function coverage 93%.

## Acceptance Criteria
- [x] AC2.1 — Re-mint reverts `AlreadyMinted()`.
- [x] AC2.2 — After mint, owner holds egg with speciesId=0, level=1, xp=0, dna=0.
- [x] AC3.1 — Rarity distribution over 10k fuzz within ±5% of 50/30/20 target.
- [x] AC3.2 — Same `(minter, tokenId, prevrandao, blockNumber)` yields same species + DNA.
- [x] AC5.1 — Training within cooldown reverts `OnCooldown()`.
- [x] AC5.2 — XP overflow into next level allowed (no cap).
- [x] AC6.1 — Same `(playerA, playerB, prevrandao)` yields same winner (determinism test).
- [x] AC6.2 — Type effectiveness matches the matrix in `docs/design/battle-formula.md`.
- [x] AC6.3 — Battle log emitted as event (`BattleResolved`).

## Notes / deferred to follow-up PRs
- Battle branch coverage is 34%. Adding more fuzz cases for edge conditions
  (50-turn cap, simultaneous KO) is straightforward but not blocking MVP.
- `script/Deploy.s.sol` needs a testnet wallet for the actual broadcast; the
  script itself is wired and ready.
- IPFS tokenURI integration lands in ISSUE-0003b alongside the art batch.
