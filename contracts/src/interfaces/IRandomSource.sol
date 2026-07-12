// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title IRandomSource
/// @notice Source of on-chain randomness for MonadMon. Phase 1 impl is
///         BlockPrevRandaoSource (ADR-0004); Phase 2 may swap to Chainlink VRF
///         without touching call sites.
interface IRandomSource {
    /// @notice Returns a 256-bit random seed bound to `salt` and the current
    ///         block. The same `(salt, block.number)` MUST deterministically
    ///         produce the same seed for any caller (within the bounds the
    ///         implementation provides).
    function seed(bytes32 salt) external view returns (uint256);
}
