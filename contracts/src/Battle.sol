// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {MonsterNFT} from "./MonsterNFT.sol";
import {TypeChart} from "./lib/TypeChart.sol";
import {IRandomSource} from "./interfaces/IRandomSource.sol";

/// @title Battle
/// @notice PvP resolver. Uses the deterministic formula documented in
///         `docs/design/battle-formula.md`.
contract Battle is Ownable, ReentrancyGuard {
    MonsterNFT public immutable nft;
    IRandomSource public immutable randomSource;

    struct Fighter {
        uint16 hp;
        uint16 atk;
        uint16 def;
        uint16 spd;
        uint8 element;
    }

    enum State {
        None,
        Pending,
        Resolved
    }

    struct Challenge {
        address challenger;
        uint256 challengerTokenId;
        address opponent;
        uint256 opponentTokenId;
        State state;
        uint256 winnerTokenId;
        uint256 loserTokenId;
        uint8 turns;
        bool draw;
    }

    uint256 public challengeCount;
    mapping(uint256 challengeId => Challenge) public challenges;

    /// @notice Returns the full Challenge struct. Auto-getter of the
    ///         public mapping returns fields as a tuple; this helper
    ///         returns the struct for ergonomic external use.
    function getChallenge(uint256 challengeId) external view returns (Challenge memory) {
        return challenges[challengeId];
    }

    event ChallengeCreated(
        uint256 indexed challengeId,
        address indexed challenger,
        uint256 challengerTokenId,
        address indexed opponent,
        uint256 opponentTokenId
    );
    event ChallengeAccepted(uint256 indexed challengeId);
    event ChallengeResolved(
        uint256 indexed challengeId,
        uint256 winnerTokenId,
        uint256 loserTokenId,
        bool draw,
        uint8 turns
    );

    error NotInvolved();
    error WrongState();
    error NotOpponent();
    error SameOwner();
    error InvalidMonster();

    constructor(MonsterNFT _nft, IRandomSource _randomSource, address initialOwner)
        Ownable(initialOwner)
    {
        require(address(_nft) != address(0), "Battle: zero nft");
        require(address(_randomSource) != address(0), "Battle: zero RNG");
        nft = _nft;
        randomSource = _randomSource;
    }

    function challenge(uint256 myTokenId, address opponent, uint256 oppTokenId)
        external
        returns (uint256 challengeId)
    {
        if (nft.ownerOf(myTokenId) != msg.sender) revert InvalidMonster();
        if (nft.ownerOf(oppTokenId) != opponent) revert InvalidMonster();
        if (nft.ownerOf(myTokenId) == opponent) revert SameOwner();

        challengeId = ++challengeCount;
        challenges[challengeId] = Challenge({
            challenger: msg.sender,
            challengerTokenId: myTokenId,
            opponent: opponent,
            opponentTokenId: oppTokenId,
            state: State.Pending,
            winnerTokenId: 0,
            loserTokenId: 0,
            turns: 0,
            draw: false
        });
        emit ChallengeCreated(challengeId, msg.sender, myTokenId, opponent, oppTokenId);
    }

    function acceptAndResolve(uint256 challengeId) external nonReentrant {
        Challenge memory c = challenges[challengeId];
        if (c.state != State.Pending) revert WrongState();
        if (c.opponent != msg.sender) revert NotOpponent();

        (uint256 winnerTokenId, uint256 loserTokenId, uint8 turns, bool draw) =
            _resolve(c.challengerTokenId, c.opponentTokenId);

        c.state = State.Resolved;
        c.winnerTokenId = winnerTokenId;
        c.loserTokenId = loserTokenId;
        c.turns = turns;
        c.draw = draw;
        challenges[challengeId] = c;

        if (!draw) {
            nft.recordBattle(winnerTokenId, loserTokenId, false);
        }

        emit ChallengeAccepted(challengeId);
        emit ChallengeResolved(challengeId, winnerTokenId, loserTokenId, draw, turns);
    }

    function _readFighter(uint256 tokenId) internal view returns (Fighter memory f) {
        (uint16 hp, uint16 atk, uint16 def, uint16 spd, uint8 el) = nft.battleView(tokenId);
        f = Fighter({hp: hp, atk: atk, def: def, spd: spd, element: el});
    }

    function _resolve(uint256 tokenA, uint256 tokenB)
        internal
        view
        returns (uint256 winnerTokenId, uint256 loserTokenId, uint8 turns, bool draw)
    {
        Fighter memory a = _readFighter(tokenA);
        Fighter memory b = _readFighter(tokenB);

        bytes32 salt = keccak256(abi.encodePacked(tokenA, tokenB));
        uint256 seed = randomSource.seed(salt);

        uint256 s = seed;
        uint8 turn;
        for (turn = 0; turn < 50 && a.hp > 0 && b.hp > 0; ++turn) {
            bool aFirst = turn == 0 ? a.spd >= b.spd : (turn % 2 == 1);
            if (aFirst) {
                b.hp = _attack(b, a, s);
                if (b.hp == 0) break;
                a.hp = _attack(a, b, s);
            } else {
                a.hp = _attack(a, b, s);
                if (a.hp == 0) break;
                b.hp = _attack(b, a, s);
            }
            s = uint256(keccak256(abi.encodePacked(s, turn)));
        }

        if (a.hp == 0 && b.hp == 0) {
            draw = true;
            winnerTokenId = tokenA;
            loserTokenId = tokenB;
        } else if (a.hp == 0) {
            winnerTokenId = tokenB;
            loserTokenId = tokenA;
        } else if (b.hp == 0) {
            winnerTokenId = tokenA;
            loserTokenId = tokenB;
        } else {
            draw = true;
            if (a.hp > b.hp) {
                winnerTokenId = tokenA;
                loserTokenId = tokenB;
            } else if (b.hp > a.hp) {
                winnerTokenId = tokenB;
                loserTokenId = tokenA;
            } else if (a.spd >= b.spd) {
                winnerTokenId = tokenA;
                loserTokenId = tokenB;
            } else {
                winnerTokenId = tokenB;
                loserTokenId = tokenA;
            }
        }
        turns = turn;
    }

    function _attack(Fighter memory def, Fighter memory atk, uint256 s)
        internal
        pure
        returns (uint16)
    {
        uint16 effBps = TypeChart.effectiveness(atk.element, def.element);
        uint256 r = (s % 31);
        uint256 randMul = 85 + r;
        uint256 crit = ((s >> 8) % 100) < 12 ? 150 : 100;
        uint256 base = uint256(atk.atk) * effBps * randMul * crit;
        uint256 defMitNum = (uint256(def.def) + 200) - uint256(def.def);
        uint256 defMit = defMitNum * 10_000 / (uint256(def.def) + 200);
        if (defMit < 1_000) defMit = 1_000;
        uint256 damage = (base * defMit) / (10_000 * 100 * 100);
        if (damage < 1) damage = 1;
        if (damage >= def.hp) return 0;
        return uint16(def.hp - damage);
    }
}
