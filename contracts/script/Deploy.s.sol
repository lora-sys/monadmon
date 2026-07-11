// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {MonsterNFT} from "../src/MonsterNFT.sol";

/// @notice Deploys MonsterNFT to the configured RPC. Full deployment lands in ISSUE-0004+0006.
/// @dev    Reads DEPLOYER_PRIVATE_KEY from environment.
contract Deploy is Script {
    function run() external {
        uint256 pk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(pk);

        vm.startBroadcast(pk);
        MonsterNFT nft = new MonsterNFT();
        vm.stopBroadcast();

        console2.log("MonsterNFT deployed at:", address(nft));
        console2.log("Deployer:", deployer);
    }
}
