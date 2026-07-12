// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {SpeciesRegistry} from "../src/lib/SpeciesRegistry.sol";
import {TypeChart} from "../src/lib/TypeChart.sol";

contract SpeciesRegistryTest is Test {
    function test_All12SpeciesReturnBaseStats() public view {
        for (uint16 i = 1; i <= 12; i++) {
            SpeciesRegistry.BaseStats memory s = SpeciesRegistry.baseStats(i);
            assertGt(s.hp, 0, "hp > 0");
            assertGt(s.atk, 0, "atk > 0");
            assertGt(s.def, 0, "def > 0");
            assertGt(s.spd, 0, "spd > 0");
            assertTrue(s.element <= 3);
            assertTrue(SpeciesRegistry.isValidSpecies(i));
        }
    }

    function test_OutOfRangeReturnsZeros() public view {
        SpeciesRegistry.BaseStats memory z = SpeciesRegistry.baseStats(0);
        assertEq(z.hp, 0);
        assertEq(z.atk, 0);
        assertEq(z.def, 0);
        assertEq(z.spd, 0);
        assertFalse(SpeciesRegistry.isValidSpecies(0));
        assertFalse(SpeciesRegistry.isValidSpecies(13));
        assertFalse(SpeciesRegistry.isValidSpecies(255));
    }

    function test_ElementMappingMatchesBrief() public view {
        // Per user brief: Fire species are 1,2,3; Water 4,5,6; Nature 7,8,9; Electric 10,11,12.
        assertEq(SpeciesRegistry.elementOf(1), TypeChart.FIRE);
        assertEq(SpeciesRegistry.elementOf(2), TypeChart.FIRE);
        assertEq(SpeciesRegistry.elementOf(3), TypeChart.FIRE);
        assertEq(SpeciesRegistry.elementOf(4), TypeChart.WATER);
        assertEq(SpeciesRegistry.elementOf(5), TypeChart.WATER);
        assertEq(SpeciesRegistry.elementOf(6), TypeChart.WATER);
        assertEq(SpeciesRegistry.elementOf(7), TypeChart.NATURE);
        assertEq(SpeciesRegistry.elementOf(8), TypeChart.NATURE);
        assertEq(SpeciesRegistry.elementOf(9), TypeChart.NATURE);
        assertEq(SpeciesRegistry.elementOf(10), TypeChart.ELECTRIC);
        assertEq(SpeciesRegistry.elementOf(11), TypeChart.ELECTRIC);
        assertEq(SpeciesRegistry.elementOf(12), TypeChart.ELECTRIC);
    }
}
