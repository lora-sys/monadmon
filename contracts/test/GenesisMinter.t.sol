// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {MonsterNFT} from "../src/MonsterNFT.sol";
import {GenesisMinter} from "../src/GenesisMinter.sol";
import {BlockPrevRandaoSource} from "../src/lib/BlockPrevRandaoSource.sol";

contract GenesisMinterTest is Test {
    MonsterNFT internal nft;
    GenesisMinter internal minter;
    BlockPrevRandaoSource internal rng;

    address internal alice = makeAddr("alice");

    function setUp() public {
        rng = new BlockPrevRandaoSource();
        nft = new MonsterNFT(address(rng), address(this));
        nft.setGenesisMinter(address(this)); // test contract acts as minter for direct calls
        minter = new GenesisMinter(nft);
        nft.setGenesisMinter(address(minter)); // minter takes over
    }

    function test_MintForwardsToPlayer() public {
        vm.prank(alice);
        uint256 tokenId = minter.mintGenesis();
        assertEq(nft.ownerOf(tokenId), alice, "alice owns the egg");
    }

    function test_MinterStillRespectsOneEggPerWallet() public {
        vm.startPrank(alice);
        minter.mintGenesis();
        vm.expectRevert(MonsterNFT.AlreadyMinted.selector);
        minter.mintGenesis();
        vm.stopPrank();
    }

    function test_RejectsZeroNFTConstructor() public {
        vm.expectRevert(bytes("GenesisMinter: zero nft"));
        new GenesisMinter(MonsterNFT(address(0)));
    }

    function test_MintGenesisForRevertsIfCallerNotMinter() public {
        vm.prank(alice);
        vm.expectRevert(MonsterNFT.NotOwner.selector);
        nft.mintGenesisFor(alice);
    }

    function test_MintGenesisForRevertsIfToIsZero() public {
        vm.expectRevert(MonsterNFT.NotOwner.selector);
        nft.mintGenesisFor(address(0));
    }
}
