// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IRandomSource} from "./interfaces/IRandomSource.sol";
import {RarityRoll} from "./lib/RarityRoll.sol";
import {Stats} from "./lib/Stats.sol";
import {SpeciesRegistry} from "./lib/SpeciesRegistry.sol";

/// @title MonsterNFT
/// @notice MonadMon creature NFT. Each token is an Egg (speciesId 0) that
///         hatches into a Monster with species, level, XP, DNA, and stats.
/// @dev    Ownable. mintGenesis is open to anyone (with one-egg-per-wallet cap).
///         hatch and train are restricted to the token owner. recordBattle is
///         restricted to the Battle contract. mintGenesisFor is restricted to
///         the genesisMinter (typically GenesisMinter).
contract MonsterNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    struct Monster {
        uint16 speciesId;
        uint16 level;
        uint32 xp;
        uint8 stage;
        uint8 _reserved0;
        uint16 _reserved1;
        uint64 dna;
        uint16 hp;
        uint16 atk;
        uint16 def;
        uint16 spd;
        uint64 lastTrainedAt;
        uint16 battlesWon;
        uint16 battlesLost;
    }

    mapping(uint256 tokenId => Monster) private _monsters;
    mapping(address owner => bool hasMinted) public hasMintedEgg;

    IRandomSource public immutable randomSource;

    uint256 public constant TRAIN_COOLDOWN = 6 hours;
    uint256 public constant MAX_LEVEL = 50;
    uint256 public constant TRAIN_XP_GAIN = 30;
    uint256 public constant TRAIN_ATK_GAIN = 2;
    uint256 public constant BATTLE_WIN_XP = 50;
    uint256 public constant BATTLE_LOSS_XP = 10;
    uint256 public constant MAX_TURNS = 50;

    uint256 private _nextTokenId;
    address public battleResolver;
    address public genesisMinter;

    event EggMinted(address indexed to, uint256 indexed tokenId);
    event MonsterHatched(uint256 indexed tokenId, uint16 speciesId, uint64 dna, uint8 rarity);
    event Trained(uint256 indexed tokenId, uint32 newXp, uint16 newAtk, uint64 trainedAt);
    event BattleResolved(uint256 indexed winnerTokenId, uint256 indexed loserTokenId, bool draw, uint8 turns);

    error AlreadyMinted();
    error NotEgg();
    error AlreadyHatched();
    error NotOwner();
    error OnCooldown();
    error MaxLevelReached();

    constructor(address _randomSource, address initialOwner) ERC721("MonadMon", "MONMON") Ownable(initialOwner) {
        require(_randomSource != address(0), "MonsterNFT: zero RNG");
        randomSource = IRandomSource(_randomSource);
    }

    function setBattleResolver(address resolver) external onlyOwner {
        battleResolver = resolver;
    }

    function setGenesisMinter(address minter) external onlyOwner {
        genesisMinter = minter;
    }

    /// @notice Mint a Genesis Egg to msg.sender. One per wallet.
    function mintGenesis() external nonReentrant returns (uint256 tokenId) {
        if (hasMintedEgg[msg.sender]) revert AlreadyMinted();
        hasMintedEgg[msg.sender] = true;
        tokenId = ++_nextTokenId;
        _safeMint(msg.sender, tokenId);
        _initEgg(tokenId);
        emit EggMinted(msg.sender, tokenId);
    }

    /// @notice Mint a Genesis Egg to `to`. Caller must be genesisMinter.
    function mintGenesisFor(address to) external nonReentrant returns (uint256 tokenId) {
        if (msg.sender != genesisMinter) revert NotOwner();
        if (to == address(0)) revert NotOwner();
        if (hasMintedEgg[to]) revert AlreadyMinted();
        hasMintedEgg[to] = true;
        tokenId = ++_nextTokenId;
        _safeMint(to, tokenId);
        _initEgg(tokenId);
        emit EggMinted(to, tokenId);
    }

    function _initEgg(uint256 tokenId) internal {
        _monsters[tokenId] = Monster({
            speciesId: 0,
            level: 1,
            xp: 0,
            stage: 0,
            _reserved0: 0,
            _reserved1: 0,
            dna: 0,
            hp: 0,
            atk: 0,
            def: 0,
            spd: 0,
            lastTrainedAt: 0,
            battlesWon: 0,
            battlesLost: 0
        });
    }

    function hatch(uint256 tokenId) external nonReentrant {
        Monster memory m = _monsters[tokenId];
        if (m.speciesId != 0) revert NotEgg();
        if (_ownerOf(tokenId) != msg.sender) revert NotOwner();

        bytes32 salt = keccak256(abi.encodePacked(tokenId, msg.sender));
        uint256 seed = randomSource.seed(salt);

        (RarityRoll.Rarity rarity, uint16 speciesId) = RarityRoll.roll(seed);
        require(SpeciesRegistry.isValidSpecies(speciesId), "MonsterNFT: bad species");

        uint64 dna = uint64(uint256(keccak256(abi.encodePacked(seed, "dna"))));
        SpeciesRegistry.BaseStats memory base = SpeciesRegistry.baseStats(speciesId);

        m.speciesId = speciesId;
        m.stage = 1;
        m.dna = dna;
        m.level = 1;
        m.xp = 0;
        m.hp = Stats.computeStat(base.hp, dna, 0, 1);
        m.atk = Stats.computeStat(base.atk, dna, 1, 1);
        m.def = Stats.computeStat(base.def, dna, 2, 1);
        m.spd = Stats.computeStat(base.spd, dna, 3, 1);
        m.lastTrainedAt = 0;
        m.battlesWon = 0;
        m.battlesLost = 0;
        _monsters[tokenId] = m;

        if (bytes(super.tokenURI(tokenId)).length == 0) {
            _setTokenURI(tokenId, _defaultTokenURI(speciesId, 1, dna));
        }

        emit MonsterHatched(tokenId, speciesId, dna, uint8(rarity));
    }

    function train(uint256 tokenId) external nonReentrant {
        if (_ownerOf(tokenId) != msg.sender) revert NotOwner();
        Monster memory m = _monsters[tokenId];
        if (m.speciesId == 0) revert NotEgg();
        if (m.level >= MAX_LEVEL) revert MaxLevelReached();
        if (m.lastTrainedAt != 0 && block.timestamp < m.lastTrainedAt + TRAIN_COOLDOWN) {
            revert OnCooldown();
        }

        m.xp += uint32(TRAIN_XP_GAIN);
        if (m.xp >= uint32(m.level) * 100 && m.level < MAX_LEVEL) {
            m.level += 1;
        }
        if (m.atk + TRAIN_ATK_GAIN > type(uint16).max) m.atk = type(uint16).max;
        else m.atk += uint16(TRAIN_ATK_GAIN);
        m.lastTrainedAt = uint64(block.timestamp);
        _monsters[tokenId] = m;

        emit Trained(tokenId, m.xp, m.atk, m.lastTrainedAt);
    }

    function recordBattle(uint256 winnerTokenId, uint256 loserTokenId, bool draw)
        external
        nonReentrant
    {
        require(msg.sender == battleResolver, "MonsterNFT: not Battle");
        Monster memory w = _monsters[winnerTokenId];
        Monster memory l = _monsters[loserTokenId];
        if (w.level < MAX_LEVEL) {
            if (w.xp + uint32(BATTLE_WIN_XP) < w.xp) w.xp = type(uint32).max;
            else w.xp += uint32(BATTLE_WIN_XP);
            if (w.xp >= uint32(w.level) * 100 && w.level < MAX_LEVEL) w.level += 1;
        }
        w.battlesWon += 1;
        if (l.level < MAX_LEVEL) {
            l.xp += uint32(BATTLE_LOSS_XP);
            if (l.xp >= uint32(l.level) * 100 && l.level < MAX_LEVEL) l.level += 1;
        }
        l.battlesLost += 1;
        _monsters[winnerTokenId] = w;
        _monsters[loserTokenId] = l;
        emit BattleResolved(winnerTokenId, loserTokenId, draw, 0);
    }

    function getMonster(uint256 tokenId) external view returns (Monster memory) {
        return _monsters[tokenId];
    }

    function battleView(uint256 tokenId) external view returns (uint16 hp, uint16 atk, uint16 def, uint16 spd, uint8 element) {
        Monster memory m = _monsters[tokenId];
        return (m.hp, m.atk, m.def, m.spd, SpeciesRegistry.elementOf(m.speciesId));
    }

    /// @dev Storage slot of the _monsters mapping, as reported by
    ///      `forge inspect MonsterNFT storage-layout`. Update this if
    ///      the inheritance order ever changes.
    uint256 internal constant _MONSTERS_SLOT = 9;

    function monsterSlot(uint256 tokenId) external pure returns (bytes32) {
        return keccak256(abi.encode(tokenId, _MONSTERS_SLOT));
    }

    function _defaultTokenURI(uint16 speciesId, uint8 stage, uint64 dna) internal pure returns (string memory) {
        return string(
            abi.encodePacked(
                "monadmon://", _u(speciesId), "/", _u(stage), "/", _hex(dna)
            )
        );
    }

    function _u(uint16 v) private pure returns (string memory) {
        if (v == 0) return "0";
        uint256 j = v;
        uint256 len;
        while (j != 0) { len++; j /= 10; }
        bytes memory b = new bytes(len);
        j = v;
        while (j != 0) { len -= 1; b[len] = bytes1(uint8(48 + j % 10)); j /= 10; }
        return string(b);
    }

    function _hex(uint64 v) private pure returns (string memory) {
        bytes16 hexchars = "0123456789abcdef";
        bytes memory b = new bytes(16);
        for (uint256 i = 0; i < 16; i++) {
            b[15 - i] = hexchars[uint8(v & 0xf)];
            v >>= 4;
        }
        return string(b);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
