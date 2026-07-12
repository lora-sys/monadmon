// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title RarityRoll
/// @notice Pure rarity math. Given a uint256 seed, picks a rarity band
///         (Common 50% / Rare 30% / Legendary 20%) and a species within the
///         band deterministically.
library RarityRoll {
    enum Rarity {
        Common, // 0 — 50% target
        Rare, // 1 — 30% target
        Legendary // 2 — 20% target
    }

    uint256 internal constant COMMON_TARGET_BPS = 5_000;
    uint256 internal constant RARE_TARGET_BPS = 3_000;

    function _common() private pure returns (uint16[8] memory list) {
        list = [uint16(1), 2, 4, 5, 7, 8, 10, 11];
    }

    function _rare() private pure returns (uint16[3] memory list) {
        list = [uint16(3), 9, 12];
    }

    function _legendary() private pure returns (uint16[1] memory list) {
        list = [uint16(6)];
    }

    function rarity(uint256 seed) internal pure returns (Rarity) {
        uint256 r = seed % 10_000;
        if (r < COMMON_TARGET_BPS) return Rarity.Common;
        if (r < COMMON_TARGET_BPS + RARE_TARGET_BPS) return Rarity.Rare;
        return Rarity.Legendary;
    }

    function speciesInBand(uint256 seed, Rarity band) internal pure returns (uint16) {
        uint256 pick = (seed >> 8);
        if (band == Rarity.Common) {
            uint16[8] memory c = _common();
            return c[pick % c.length];
        }
        if (band == Rarity.Rare) {
            uint16[3] memory r = _rare();
            return r[pick % r.length];
        }
        uint16[1] memory lg = _legendary();
        return lg[pick % lg.length];
    }

    function roll(uint256 seed) internal pure returns (Rarity band, uint16 speciesId) {
        band = rarity(seed);
        speciesId = speciesInBand(seed, band);
    }
}
