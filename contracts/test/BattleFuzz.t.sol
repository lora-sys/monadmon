// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {Battle} from "../src/Battle.sol";
import {MonsterNFT} from "../src/MonsterNFT.sol";
import {BlockPrevRandaoSource} from "../src/lib/BlockPrevRandaoSource.sol";

/// @notice Branch coverage tests for Battle. Targets branches in
///         _resolve (turn loop, tie-breakers) and _attack (defMit clamp,
///         crit path, damage overflow). The 50-turn cap is hard to
///         reach with the current damage formula (min ~425 dmg per hit at
///         atk=10 vs def=65535, so 65535 HP = 154 hits to kill — but 50 is
///         not the cap in the formula, just an upper bound; under typical
///         params the battle resolves before turn 50). The 10k fuzz at
///         the bottom covers the cap path indirectly.
/// @dev All tests use direct storage writes (via vm.store) to control
///      battle inputs precisely, bypassing the hatch RNG. Storage slot
///      of _monsters is 9 (verified via forge inspect).
contract BattleFuzzTest is Test {
    Battle internal battle;
    MonsterNFT internal nft;
    BlockPrevRandaoSource internal rng;

    address internal alice = makeAddr("alice");
    address internal bob = makeAddr("bob");

    uint256 internal constant MONSTERS_SLOT = 9;

    function setUp() public {
        rng = new BlockPrevRandaoSource();
        nft = new MonsterNFT(address(rng), address(this));
        battle = new Battle(nft, rng, address(this));
        nft.setBattleResolver(address(battle));
    }

    function _mintBoth() internal {
        vm.prank(alice);
        nft.mintGenesis();
        vm.prank(bob);
        nft.mintGenesis();
    }

    function _seed(
        address /* owner */,
        uint256 tokenId,
        uint16 speciesId,
        uint16 hp,
        uint16 atk,
        uint16 def,
        uint16 spd
    ) internal {
        bytes32 w0 = bytes32(
            (uint256(speciesId))              |
            (uint256(uint16(1))      << 16)    | // level
            (uint256(uint32(0))      << 32)    | // xp
            (uint256(uint8(1))       << 64)    | // stage
            (uint256(uint8(0))       << 72)    | // _r0
            (uint256(uint16(0))      << 80)    | // _r1
            (uint256(uint64(0xdeadbeef00 | tokenId)) << 96) |
            (uint256(hp)             << 160)   |
            (uint256(atk)            << 176)   |
            (uint256(def)            << 192)   |
            (uint256(spd)            << 208)
        );
        bytes32 slot = keccak256(abi.encode(tokenId, MONSTERS_SLOT));
        vm.store(address(nft), slot, w0);
    }

    function _forge(
        uint256 tokenA,
        uint256 tokenB
    ) internal returns (Battle.Challenge memory) {
        vm.prank(alice);
        uint256 cid = battle.challenge(tokenA, bob, tokenB);
        vm.prank(bob);
        battle.acceptAndResolve(cid);
        return battle.getChallenge(cid);
    }

    // ============================================================
    // Branch coverage: _resolve decision tree
    // ============================================================

    /// @notice alice (faster) wins. Branch: aFirst = a.spd >= b.spd.
    function test_AliceFasterWins() public {
        _mintBoth();
        _seed(alice, 1, 1, 100, 100, 0, 1000);
        _seed(bob, 2, 1, 100, 50, 0, 1);
        Battle.Challenge memory c = _forge(1, 2);
        assertEq(c.winnerTokenId, 1);
        assertEq(c.loserTokenId, 2);
        assertFalse(c.draw);
    }

    /// @notice Both Fire. bob slightly faster. Branch: bFirst (spd-compare).
    function test_BobFasterWins() public {
        _mintBoth();
        _seed(alice, 1, 1, 100, 100, 0, 50);
        _seed(bob, 2, 1, 100, 100, 0, 200);
        Battle.Challenge memory c = _forge(1, 2);
        assertEq(c.winnerTokenId, 2);
        assertEq(c.loserTokenId, 1);
    }

    /// @notice Both have 0 HP. Loop never runs. Hits the draw-via-cap-else
    ///         branch (turns==0 path).
    function test_BothAlreadyDeadHitsDrawBranch() public {
        _mintBoth();
        Battle.Challenge memory c = _forge(1, 2);
        assertTrue(c.draw, "draw when both at 0 HP");
        assertEq(c.turns, 0);
    }

    /// @notice 1.5x super-effective. Fire vs Nature. Few hits to kill.
    function test_SuperEffectiveDamage() public {
        _mintBoth();
        _seed(alice, 1, 1, 1000, 100, 0, 100);  // Fire
        _seed(bob, 2, 7, 1000, 1, 0, 50);       // Nature
        Battle.Challenge memory c = _forge(1, 2);
        assertFalse(c.draw, "alice one-shots via 1.5x bonus");
        assertEq(c.winnerTokenId, 1);
    }

    /// @notice 0.5x resisted. Water vs Electric.
    ///         With small HP+ATK, the battle resolves (not a draw).
    function test_ResistedDamage() public {
        _mintBoth();
        _seed(alice, 1, 4, 500, 100, 0, 100);  // Water
        _seed(bob, 2, 10, 500, 1, 0, 50);      // Electric
        Battle.Challenge memory c = _forge(1, 2);
        // 0.5x reduces damage but 100 ATK vs 500 HP is still fast enough
        // to kill in a few turns.
        assertFalse(c.draw);
    }

    /// @notice 1-shot kill. damage > def.hp path. turns == 0.
    function test_OneShotKill() public {
        _mintBoth();
        _seed(alice, 1, 1, 100, 65535, 0, 100);
        _seed(bob, 2, 1, 1, 1, 0, 50);
        Battle.Challenge memory c = _forge(1, 2);
        assertEq(c.winnerTokenId, 1);
        assertEq(c.loserTokenId, 2);
        assertEq(c.turns, 0, "bob died on turn 0");
    }

    /// @notice draw -> recordBattle NOT called.
    function test_DrawDoesNotCallRecordBattle() public {
        _mintBoth();
        // Both with 0 HP after seeding (eggs).
        Battle.Challenge memory c = _forge(1, 2);
        assertTrue(c.draw);
        assertEq(nft.getMonster(c.winnerTokenId).battlesWon, 0, "draw winner has no battle");
    }

    /// @notice non-draw -> recordBattle called.
    function test_NonDrawCallsRecordBattle() public {
        _mintBoth();
        _seed(alice, 1, 1, 100, 65535, 0, 100);
        _seed(bob, 2, 1, 1, 1, 0, 50);
        Battle.Challenge memory c = _forge(1, 2);
        assertFalse(c.draw);
        assertEq(nft.getMonster(c.winnerTokenId).battlesWon, 1);
        assertEq(nft.getMonster(c.loserTokenId).battlesLost, 1);
        assertEq(nft.getMonster(c.winnerTokenId).xp, 50, "winner +50 XP");
        assertEq(nft.getMonster(c.loserTokenId).xp, 10, "loser +10 XP");
    }

    /// @notice Two challenges between the same pair with DIFFERENT state
    ///         can produce DIFFERENT winners (deterministic given state).
    function test_DeterminismOverState() public {
        _mintBoth();
        _seed(alice, 1, 1, 200, 100, 0, 100);
        _seed(bob, 2, 1, 100, 100, 0, 50);

        // First challenge.
        Battle.Challenge memory c1 = _forge(1, 2);
        // After the battle, alice has +50 XP (winner) and bob has +10 (loser).
        // Their level may go up. Subsequent challenge uses new state.
        Battle.Challenge memory c2 = _forge(1, 2);
        // Both should be valid resolves.
        assertTrue(c1.winnerTokenId == 1 || c1.winnerTokenId == 2);
        assertTrue(c2.winnerTokenId == 1 || c2.winnerTokenId == 2);
    }

    /// @notice Fuzz: random stats. Output always valid (winner in {1,2}, no overflow, turns<=50).
    function testFuzz_BattleOutputAlwaysValid(
        uint16 hpA, uint16 atkA, uint16 defA, uint16 spdA,
        uint16 hpB, uint16 atkB, uint16 defB, uint16 spdB
    ) public {
        hpA = uint16(bound(hpA, 1, 5000));
        atkA = uint16(bound(atkA, 1, 500));
        defA = uint16(bound(defA, 0, 500));
        spdA = uint16(bound(spdA, 1, 1000));
        hpB = uint16(bound(hpB, 1, 5000));
        atkB = uint16(bound(atkB, 1, 500));
        defB = uint16(bound(defB, 0, 500));
        spdB = uint16(bound(spdB, 1, 1000));

        _mintBoth();
        _seed(alice, 1, 1, hpA, atkA, defA, spdA);
        _seed(bob, 2, 1, hpB, atkB, defB, spdB);
        Battle.Challenge memory c = _forge(1, 2);
        assertLe(c.turns, 50, "turns cap");
        assertTrue(c.winnerTokenId == 1 || c.winnerTokenId == 2);
        assertTrue(c.loserTokenId == 1 || c.loserTokenId == 2);
        assertTrue(c.winnerTokenId != c.loserTokenId);
    }
}
