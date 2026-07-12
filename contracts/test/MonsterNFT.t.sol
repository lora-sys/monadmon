// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {MonsterNFT} from "../src/MonsterNFT.sol";
import {BlockPrevRandaoSource} from "../src/lib/BlockPrevRandaoSource.sol";

contract MonsterNFTTest is Test {
    MonsterNFT internal nft;
    BlockPrevRandaoSource internal rng;

    address internal alice = makeAddr("alice");
    address internal bob = makeAddr("bob");

    function setUp() public {
        rng = new BlockPrevRandaoSource();
        nft = new MonsterNFT(address(rng), address(this));
    }

    // -------- ERC-721 basics --------

    function test_NameAndSymbol() public view {
        assertEq(nft.name(), "MonadMon");
        assertEq(nft.symbol(), "MONMON");
    }

    // -------- Mint --------

    function test_MintGenesisHappyPath() public {
        vm.prank(alice);
        uint256 tokenId = nft.mintGenesis();
        assertEq(tokenId, 1);
        assertEq(nft.ownerOf(tokenId), alice);
        MonsterNFT.Monster memory m = nft.getMonster(tokenId);
        assertEq(m.speciesId, 0, "egg speciesId=0");
        assertEq(m.level, 1, "egg starts at level 1");
        assertEq(m.dna, 0, "egg dna=0");
        assertEq(m.xp, 0);
    }

    function test_MintGenesisIsOnePerWallet() public {
        vm.startPrank(alice);
        nft.mintGenesis();
        vm.expectRevert(MonsterNFT.AlreadyMinted.selector);
        nft.mintGenesis();
        vm.stopPrank();
    }

    function test_MintGenesisIncrementsTokenId() public {
        vm.prank(alice);
        uint256 t1 = nft.mintGenesis();
        vm.prank(bob);
        uint256 t2 = nft.mintGenesis();
        assertEq(t1, 1);
        assertEq(t2, 2);
    }

    // -------- Hatch --------

    function test_HatchAssignsSpeciesAndDna() public {
        vm.prank(alice);
        uint256 tokenId = nft.mintGenesis();
        vm.prank(alice);
        nft.hatch(tokenId);

        MonsterNFT.Monster memory m = nft.getMonster(tokenId);
        assertTrue(m.speciesId >= 1 && m.speciesId <= 12, "species 1..12");
        assertEq(m.stage, 1);
        assertGt(m.dna, 0);
        assertEq(m.level, 1);
        assertGt(m.hp, 0);
        assertGt(m.atk, 0);
        assertGt(m.def, 0);
        assertGt(m.spd, 0);
    }

    function test_HatchRevertsOnSecondHatch() public {
        vm.prank(alice);
        uint256 tokenId = nft.mintGenesis();
        vm.prank(alice);
        nft.hatch(tokenId);
        vm.prank(alice);
        vm.expectRevert(MonsterNFT.NotEgg.selector);
        nft.hatch(tokenId);
    }

    function test_HatchRevertsIfNotOwner() public {
        vm.prank(alice);
        uint256 tokenId = nft.mintGenesis();
        vm.prank(bob);
        vm.expectRevert(MonsterNFT.NotOwner.selector);
        nft.hatch(tokenId);
    }

    // -------- Train --------

    function test_TrainHappyPath() public {
        vm.prank(alice);
        uint256 tokenId = nft.mintGenesis();
        vm.prank(alice);
        nft.hatch(tokenId);

        uint16 atkBefore = nft.getMonster(tokenId).atk;
        vm.warp(10_000);
        vm.prank(alice);
        nft.train(tokenId);

        MonsterNFT.Monster memory m = nft.getMonster(tokenId);
        assertEq(m.xp, 30);
        assertEq(m.atk, atkBefore + 2);
        assertEq(m.lastTrainedAt, 10_000);
    }

    function test_TrainRevertsOnCooldown() public {
        vm.prank(alice);
        uint256 tokenId = nft.mintGenesis();
        vm.prank(alice);
        nft.hatch(tokenId);

        vm.warp(10_000);
        vm.prank(alice);
        nft.train(tokenId);

        // 6h - 1s later, still on cooldown.
        vm.warp(10_000 + 6 hours - 1);
        vm.prank(alice);
        vm.expectRevert(MonsterNFT.OnCooldown.selector);
        nft.train(tokenId);
    }

    function test_TrainCooldownExpires() public {
        vm.prank(alice);
        uint256 tokenId = nft.mintGenesis();
        vm.prank(alice);
        nft.hatch(tokenId);

        vm.warp(10_000);
        vm.prank(alice);
        nft.train(tokenId);

        vm.warp(10_000 + 6 hours + 1);
        vm.prank(alice);
        nft.train(tokenId); // should not revert
    }

    // -------- Helpers --------

    function test_MonsterSlotIsStable() public view {
        assertEq(nft.monsterSlot(7), keccak256(abi.encode(uint256(7), uint256(0))));
    }
}
