// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {MonsterNFT} from "../src/MonsterNFT.sol";

contract MonsterNFTTest is Test {
    MonsterNFT internal nft;

    function _slot(uint256 tokenId) internal pure returns (bytes32) {
        return keccak256(abi.encode(tokenId, uint256(0)));
    }

    /// @dev Writes a Monster struct directly to storage. Mirrors Solidity's
    ///      tight packing (low bits first, in declaration order).
    function _writeMonster(uint256 tokenId, MonsterNFT.Monster memory m) internal {
        // Slot 0: speciesId(16) | level(16) | xp(32) | stage(8) | _reserved0(8)
        //        | _reserved1(16) | dna(64) | hp(16) | atk(16) | def(16) | spd(16)
        bytes32 w0 = bytes32(
            (uint256(m.spd) << 208) | (uint256(m.def) << 192) | (uint256(m.atk) << 176)
                | (uint256(m.hp) << 160) | (uint256(m.dna) << 96) | (uint256(m._reserved1) << 80)
                | (uint256(m._reserved0) << 72) | (uint256(m.stage) << 64) | (uint256(m.xp) << 32)
                | (uint256(m.level) << 16) | (uint256(m.speciesId))
        );
        vm.store(address(nft), _slot(tokenId), w0);

        // Slot 1: lastTrainedAt(64) | battlesWon(16) | battlesLost(16)
        bytes32 w1 = bytes32(
            (uint256(m.battlesLost) << 80) | (uint256(m.battlesWon) << 64)
                | (uint256(m.lastTrainedAt))
        );
        vm.store(address(nft), bytes32(uint256(_slot(tokenId)) + 1), w1);
    }

    function setUp() public {
        nft = new MonsterNFT();
    }

    function test_NameAndSymbol() public view {
        assertEq(nft.name(), "MonadMon");
        assertEq(nft.symbol(), "MONMON");
    }

    function test_UnmintedMonsterIsZero() public view {
        MonsterNFT.Monster memory m = nft.getMonster(1);
        assertEq(m.speciesId, 0);
        assertEq(m.level, 0);
        assertEq(m.xp, 0);
        assertEq(m.stage, 0);
        assertEq(m.dna, 0);
        assertEq(m.hp, 0);
        assertEq(m.atk, 0);
        assertEq(m.def, 0);
        assertEq(m.spd, 0);
        assertEq(m.lastTrainedAt, 0);
        assertEq(m.battlesWon, 0);
        assertEq(m.battlesLost, 0);
    }

    function test_SetMonsterRoundTrip() public {
        MonsterNFT.Monster memory seed = MonsterNFT.Monster({
            speciesId: 5,
            level: 7,
            xp: 12345,
            stage: 2,
            _reserved0: 0,
            _reserved1: 0,
            dna: 0xA83F920000000001,
            hp: 320,
            atk: 180,
            def: 110,
            spd: 140,
            lastTrainedAt: 1_700_000_000,
            battlesWon: 12,
            battlesLost: 4
        });
        _writeMonster(42, seed);

        MonsterNFT.Monster memory got = nft.getMonster(42);
        assertEq(got.speciesId, 5);
        assertEq(got.level, 7);
        assertEq(got.xp, 12345);
        assertEq(got.stage, 2);
        assertEq(got.dna, 0xA83F920000000001);
        assertEq(got.hp, 320);
        assertEq(got.atk, 180);
        assertEq(got.def, 110);
        assertEq(got.spd, 140);
        assertEq(got.lastTrainedAt, 1_700_000_000);
        assertEq(got.battlesWon, 12);
        assertEq(got.battlesLost, 4);
    }

    function test_MonsterSlotIsStable() public view {
        assertEq(nft.monsterSlot(7), keccak256(abi.encode(uint256(7), uint256(0))));
    }
}
