// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MonsterNFT} from "./MonsterNFT.sol";

/// @title GenesisMinter
/// @notice Front-end / analytics wrapper around MonsterNFT.mintGenesisFor.
///         Keeps a stable external surface so the FE ABI does not change
///         when MonsterNFT internals evolve.
contract GenesisMinter {
    MonsterNFT public immutable nft;

    constructor(MonsterNFT _nft) {
        require(address(_nft) != address(0), "GenesisMinter: zero nft");
        nft = _nft;
    }

    /// @notice Mint a Genesis Egg to msg.sender.
    function mintGenesis() external returns (uint256 tokenId) {
        return nft.mintGenesisFor(msg.sender);
    }
}
