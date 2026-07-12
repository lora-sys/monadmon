// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {MonsterNFT} from "../../src/MonsterNFT.sol";
import {Battle} from "../../src/Battle.sol";
import {BlockPrevRandaoSource} from "../../src/lib/BlockPrevRandaoSource.sol";

/// @notice End-to-end: mint -> hatch -> train -> battle between two players.
contract MonsterFlowTest is Test {
    MonsterNFT internal nft;
    Battle internal battle;
    BlockPrevRandaoSource internal rng;

    address internal alice = makeAddr("alice");
    address internal bob = makeAddr("bob");

    function setUp() public {
        rng = new BlockPrevRandaoSource();
        nft = new MonsterNFT(address(rng), address(this));
        battle = new Battle(nft, rng, address(this));
        nft.setBattleResolver(address(battle));
    }

    function test_FullFlowMintHatchTrainBattle() public {
        vm.warp(10_000);

        // Alice: mint + hatch + train
        vm.startPrank(alice);
        uint256 a = nft.mintGenesis();
        nft.hatch(a);
        MonsterNFT.Monster memory a0 = nft.getMonster(a);
        nft.train(a);
        vm.stopPrank();

        // Bob: mint + hatch (no train)
        vm.startPrank(bob);
        uint256 b = nft.mintGenesis();
        nft.hatch(b);
        vm.stopPrank();

        MonsterNFT.Monster memory aPost = nft.getMonster(a);
        MonsterNFT.Monster memory bPost = nft.getMonster(b);

        // Post-hatch invariants
        assertGt(aPost.speciesId, 0);
        assertGt(bPost.speciesId, 0);
        assertGt(aPost.atk, 0);
        assertGt(bPost.atk, 0);

        // Train produced: +30 xp, +2 atk, lastTrainedAt set
        assertEq(aPost.xp, 30, "alice +30 xp from train");
        assertEq(aPost.atk, a0.atk + 2, "alice +2 atk from train");
        assertEq(aPost.lastTrainedAt, 10_000);

        // Bob didn't train
        assertEq(bPost.xp, 0);
        assertEq(bPost.lastTrainedAt, 0);

        // Battle
        vm.prank(alice);
        uint256 cid = battle.challenge(a, bob, b);

        vm.prank(bob);
        battle.acceptAndResolve(cid);

        Battle.Challenge memory c = battle.getChallenge(cid);
        assertEq(uint8(c.state), uint8(Battle.State.Resolved));

        if (!c.draw) {
            MonsterNFT.Monster memory w = nft.getMonster(c.winnerTokenId);
            MonsterNFT.Monster memory l = nft.getMonster(c.loserTokenId);
            assertEq(w.battlesWon, 1);
            assertEq(l.battlesLost, 1);
        }
    }
}
