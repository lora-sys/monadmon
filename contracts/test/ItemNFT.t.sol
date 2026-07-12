// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {ItemNFT} from "../src/ItemNFT.sol";

contract ItemNFTTest is Test {
    ItemNFT internal items;
    address internal alice = makeAddr("alice");
    address internal owner = address(this);

    function setUp() public {
        items = new ItemNFT(owner, "ipfs://test/");
    }

    function test_OwnerCanMint() public {
        items.mint(alice, 1, 100, "");
        assertEq(items.balanceOf(alice, 1), 100);
    }

    function test_NonOwnerCannotMint() public {
        vm.prank(alice);
        vm.expectRevert();
        items.mint(alice, 1, 100, "");
    }

    function test_SetURI() public {
        items.setURI("ipfs://new/");
        assertEq(items.uri(1), "ipfs://new/");
    }
}
