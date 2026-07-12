// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MonsterNFT} from "../MonsterNFT.sol";

/// @notice External interface for MonsterNFT consumers (Battle, indexer, FE).
interface IMonsterNFT {
    function getMonster(uint256 tokenId) external view returns (MonsterNFT.Monster memory);
    function ownerOf(uint256 tokenId) external view returns (address);
    function balanceOf(address owner) external view returns (uint256);
    function tokenURI(uint256 tokenId) external view returns (string memory);
}
