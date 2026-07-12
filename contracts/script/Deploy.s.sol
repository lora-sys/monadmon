// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {MonsterNFT} from "../src/MonsterNFT.sol";
import {ItemNFT} from "../src/ItemNFT.sol";
import {GenesisMinter} from "../src/GenesisMinter.sol";
import {Battle} from "../src/Battle.sol";
import {BlockPrevRandaoSource} from "../src/lib/BlockPrevRandaoSource.sol";

contract Deploy is Script {
    function run() external returns (MonsterNFT nft, ItemNFT items, GenesisMinter minter, Battle battle, BlockPrevRandaoSource rng) {
        uint256 pk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(pk);

        vm.startBroadcast(pk);
        rng = new BlockPrevRandaoSource();
        nft = new MonsterNFT(address(rng), deployer);
        items = new ItemNFT(deployer, "ipfs://placeholder/");
        minter = new GenesisMinter(nft);
        battle = new Battle(nft, rng, deployer);
        nft.setBattleResolver(address(battle));
        nft.setGenesisMinter(address(minter));
        vm.stopBroadcast();

        console2.log("MonsterNFT       :", address(nft));
        console2.log("ItemNFT          :", address(items));
        console2.log("GenesisMinter    :", address(minter));
        console2.log("Battle           :", address(battle));
        console2.log("BlockPrevRandao  :", address(rng));
        console2.log("Deployer         :", deployer);
    }
}
