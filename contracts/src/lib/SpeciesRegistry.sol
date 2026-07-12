// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SpeciesRegistry
/// @notice Pure lookup of the 12-species catalog. Embedded as constants so the
///         contract has no external dependency on the off-chain JSON. The
///         JSON in `frontend/public/data/species.json` is the source for
///         art; this file is the source for on-chain stats.
///
///         Field order matches `MonsterNFT.Monster.stages[1]`:
///         hp, atk, def, spd.
library SpeciesRegistry {
    struct BaseStats {
        uint16 hp;
        uint16 atk;
        uint16 def;
        uint16 spd;
        uint8 element; // see TypeChart
    }

    /// @notice Element ids.
    uint8 internal constant FIRE = 0;
    uint8 internal constant WATER = 1;
    uint8 internal constant NATURE = 2;
    uint8 internal constant ELECTRIC = 3;

    /// @notice Returns base stage-1 stats for species id 1..12.
    ///         Returns zeros for species id 0 (egg) or out-of-range.
    function baseStats(uint16 speciesId) internal pure returns (BaseStats memory) {
        if (speciesId == 1) return BaseStats({hp: 80, atk: 90, def: 50, spd: 100, element: FIRE});
        if (speciesId == 2) return BaseStats({hp: 120, atk: 70, def: 110, spd: 30, element: FIRE});
        if (speciesId == 3) return BaseStats({hp: 90, atk: 130, def: 60, spd: 90, element: FIRE});
        if (speciesId == 4) return BaseStats({hp: 85, atk: 75, def: 65, spd: 110, element: WATER});
        if (speciesId == 5) return BaseStats({hp: 130, atk: 60, def: 120, spd: 40, element: WATER});
        if (speciesId == 6) return BaseStats({hp: 110, atk: 140, def: 85, spd: 70, element: WATER});
        if (speciesId == 7) return BaseStats({hp: 95, atk: 70, def: 75, spd: 95, element: NATURE});
        if (speciesId == 8) return BaseStats({hp: 140, atk: 60, def: 130, spd: 25, element: NATURE});
        if (speciesId == 9) return BaseStats({hp: 100, atk: 100, def: 100, spd: 100, element: NATURE});
        if (speciesId == 10) return BaseStats({hp: 70, atk: 110, def: 50, spd: 140, element: ELECTRIC});
        if (speciesId == 11) return BaseStats({hp: 60, atk: 90, def: 40, spd: 150, element: ELECTRIC});
        if (speciesId == 12) return BaseStats({hp: 120, atk: 130, def: 100, spd: 110, element: ELECTRIC});
        return BaseStats({hp: 0, atk: 0, def: 0, spd: 0, element: 0});
    }

    function elementOf(uint16 speciesId) internal pure returns (uint8) {
        return baseStats(speciesId).element;
    }

    function isValidSpecies(uint16 speciesId) internal pure returns (bool) {
        return speciesId >= 1 && speciesId <= 12;
    }
}
