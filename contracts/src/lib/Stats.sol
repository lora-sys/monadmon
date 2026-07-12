// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Stats
/// @notice Pure stat calculation. Bounds individual Monster stats within
///         ±10% of the species base at level 1, with +2% per level.
library Stats {
    /// @notice Generates a deterministic value in [0, 1) from a 64-bit DNA
    ///         hash and a 4-bit salt. Uses the lowest 53 bits for IEEE-754
    ///         double precision (no precision loss in JS).
    function rand01(uint64 dna, uint8 salt) internal pure returns (uint256) {
        uint256 h = uint256(keccak256(abi.encodePacked(dna, salt)));
        return (h >> 11) % 1_000_000; // 0..999_999
    }

    /// @notice Applies the DNA tilt + level curve to a base stat. Result is
    ///         floored to uint16. Tilt is in [0.9, 1.1]; level bonus is +2%
    ///         per level (capped at level 50 → +100%).
    function computeStat(uint16 base, uint64 dna, uint8 salt, uint16 level) internal pure returns (uint16) {
        uint256 r = rand01(dna, salt); // 0..999_999
        // tilt ∈ [0.9, 1.1]  = 0.9 + (r / 999_999) * 0.2
        // To stay in integer math: tiltBps = 9_000 + (r * 20_000) / 999_999
        uint256 tiltBps = 9_000 + (r * 20_000) / 999_999;
        // level bonus: 1.0 + (level - 1) * 0.02 = 1.0 .. 2.0 (at level 50)
        uint256 levelBps = 10_000 + (uint256(level > 50 ? 50 : level) - 1) * 200;
        // stat = base * tiltBps * levelBps / 1e8
        uint256 result = (uint256(base) * tiltBps * levelBps) / 100_000_000;
        if (result > type(uint16).max) result = type(uint16).max;
        return uint16(result);
    }
}
