# Smart Contract Architecture

## Layout
```
contracts/
├── src/
│   ├── MonsterNFT.sol         # ERC-721 + species/level/xp/dna/stats
│   ├── ItemNFT.sol            # ERC-1155 (Phase 2)
│   ├── GenesisMinter.sol      # one-per-wallet mint + hatch reveal
│   ├── Battle.sol             # challenge / accept / resolve
│   ├── interfaces/
│   │   ├── IRandomSource.sol
│   │   └── IMonsterNFT.sol
│   └── lib/
│       ├── TypeChart.sol      # type effectiveness (pure)
│       ├── RarityRoll.sol     # rarity from seed
│       └── Stats.sol          # base stats per species
├── test/
│   ├── MonsterNFT.t.sol
│   ├── GenesisMinter.t.sol
│   ├── Battle.t.sol
│   └── integration/MonadFork.t.sol
└── script/
    ├── Deploy.s.sol
    └── SeedSpecies.s.sol
```

## Ownership
- All contracts `Ownable2Step` (OZ v5). Phase 1 owner = deployer EOA from `.env`.
- Phase 2 may move to `AccessControl` for roles (MINTER, ADMIN, etc.).

## Token standards
- `MonsterNFT`: ERC-721 + ERC-721URIStorage. `tokenURI` resolves to IPFS JSON (species name, image, attributes).
- `ItemNFT`: ERC-1155 with per-id supply caps. Phase 2.

## Storage shape (MonsterNFT)
```solidity
struct Monster {
    uint16 speciesId;    // 0 = unhatched egg; 1..12 = species
    uint16 level;        // starts at 1
    uint32 xp;           // cumulative XP
    uint8  stage;        // 0..2 evolution stage
    uint64 dna;          // individual DNA (traits packed)
    uint16 hp;
    uint16 atk;
    uint16 def;
    uint16 spd;
    uint64 lastTrainedAt;
    uint16 battlesWon;
    uint16 battlesLost;
}
mapping(uint256 tokenId => Monster) public monsters;
```

## Randomness
- `IRandomSource` interface. MVP impl = `CommitRevealRandomSource` using `block.prevrandao` (post-merge beacon).
- See ADR-0004 for rationale.

## Custom errors (selection)
- `AlreadyMinted()`, `NotEgg()`, `AlreadyHatched()`, `NotOwner()`, `OnCooldown()`, `InvalidOpponent()`, `BattleAlreadyResolved()`, `NotInvolved()`, `BadSeed()`.

## Gas targets
- mint: < 150k
- hatch: < 250k
- train: < 80k
- challenge: < 120k
- resolveBattle: < 200k

## Upgradeability
- **MVP: non-upgradeable.** Audit-style simplicity wins.
- Phase 2+ may introduce UUPS proxy for `Battle` (most likely to evolve). ADR required.

## Reentrancy
- All state-changing external functions use `nonReentrant` (OZ v5).
- Pull-payment pattern only if monetary flows appear.
