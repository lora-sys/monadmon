// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IRandomSource} from "../interfaces/IRandomSource.sol";

/// @title BlockPrevRandaoSource
/// @notice IRandomSource implementation using the post-merge beacon
///         randomness (`block.prevrandao`). See ADR-0004 for bias analysis.
///
/// @dev    The seed is `keccak256(salt || prevrandao || block.number)` so the
///         output changes every block. For the hatch use case this is
///         acceptable because the hatch is non-monetary (no entry fee).
contract BlockPrevRandaoSource is IRandomSource {
    function seed(bytes32 salt) external view override returns (uint256) {
        return uint256(keccak256(abi.encodePacked(salt, block.prevrandao, block.number)));
    }
}
