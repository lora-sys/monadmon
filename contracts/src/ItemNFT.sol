// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title ItemNFT
/// @notice ERC-1155 scaffold for MonadMon items (stones, candies, cores).
///         No mint functions in Phase 1; Phase 2 wires drops + crafting.
contract ItemNFT is ERC1155, Ownable {
    constructor(address initialOwner, string memory baseUri)
        ERC1155(baseUri)
        Ownable(initialOwner)
    {}

    function setURI(string memory newUri) external onlyOwner {
        _setURI(newUri);
    }

    /// @notice Phase 2 mint helper. Stub for now — keep the function so the
    ///         selector is stable across deploys.
    function mint(address to, uint256 id, uint256 amount, bytes memory data) external onlyOwner {
        _mint(to, id, amount, data);
    }
}
