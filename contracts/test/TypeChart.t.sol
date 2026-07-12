// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {TypeChart} from "../src/lib/TypeChart.sol";

contract TypeChartTest is Test {
    /// @notice Golden-vector matrix matching `docs/design/battle-formula.md`
    ///         and the user brief. Rows are the attacker element;
    ///         columns are the defender element. Order: Fire, Water, Nature, Electric.
    function test_EffectivenessMatrix() public view {
        //                  Fire def  Water def  Nature def  Electric def
        // Attacker Fire     [   1.0  ,    0.5  ,    1.5   ,    1.0    ]
        uint16[4] memory fireRow     = [uint16(10_000), 5_000, 15_000, 10_000];
        // Attacker Water    [   1.5  ,    1.0  ,    0.5   ,    0.5    ]
        //   W beats F; W weak to N (N beats W); W weak to E (E beats W).
        uint16[4] memory waterRow    = [uint16(15_000), 10_000, 5_000, 5_000];
        // Attacker Nature   [   0.5  ,    1.5  ,    1.0   ,    1.0    ]
        //   N weak to F; N beats W; N vs E is neutral.
        uint16[4] memory natureRow   = [uint16(5_000), 15_000, 10_000, 10_000];
        // Attacker Electric [   1.0  ,    1.5  ,    0.5   ,    1.0    ]
        //   E vs F neutral; E beats W; E weak to N.
        uint16[4] memory electricRow = [uint16(10_000), 15_000, 5_000, 10_000];

        // Attacker Fire
        assertEq(TypeChart.effectiveness(TypeChart.FIRE, TypeChart.FIRE), fireRow[0]);
        assertEq(TypeChart.effectiveness(TypeChart.FIRE, TypeChart.WATER), fireRow[1]);
        assertEq(TypeChart.effectiveness(TypeChart.FIRE, TypeChart.NATURE), fireRow[2]);
        assertEq(TypeChart.effectiveness(TypeChart.FIRE, TypeChart.ELECTRIC), fireRow[3]);

        // Attacker Water
        assertEq(TypeChart.effectiveness(TypeChart.WATER, TypeChart.FIRE), waterRow[0]);
        assertEq(TypeChart.effectiveness(TypeChart.WATER, TypeChart.WATER), waterRow[1]);
        assertEq(TypeChart.effectiveness(TypeChart.WATER, TypeChart.NATURE), waterRow[2]);
        assertEq(TypeChart.effectiveness(TypeChart.WATER, TypeChart.ELECTRIC), waterRow[3]);

        // Attacker Nature
        assertEq(TypeChart.effectiveness(TypeChart.NATURE, TypeChart.FIRE), natureRow[0]);
        assertEq(TypeChart.effectiveness(TypeChart.NATURE, TypeChart.WATER), natureRow[1]);
        assertEq(TypeChart.effectiveness(TypeChart.NATURE, TypeChart.NATURE), natureRow[2]);
        assertEq(TypeChart.effectiveness(TypeChart.NATURE, TypeChart.ELECTRIC), natureRow[3]);

        // Attacker Electric
        assertEq(TypeChart.effectiveness(TypeChart.ELECTRIC, TypeChart.FIRE), electricRow[0]);
        assertEq(TypeChart.effectiveness(TypeChart.ELECTRIC, TypeChart.WATER), electricRow[1]);
        assertEq(TypeChart.effectiveness(TypeChart.ELECTRIC, TypeChart.NATURE), electricRow[2]);
        assertEq(TypeChart.effectiveness(TypeChart.ELECTRIC, TypeChart.ELECTRIC), electricRow[3]);
    }

    /// @notice Diagonal (same element) is always NORMAL. Quick smoke.
    function testFuzz_SameElementIsNormal(uint8 element) public view {
        element = element % 4;
        assertEq(TypeChart.effectiveness(element, element), TypeChart.NORMAL_BPS);
    }

    /// @notice Each (attacker, defender) pair returns one of the 3 documented bps levels.
    function testFuzz_OnlyValidBps(uint8 attacker, uint8 defender) public view {
        attacker = attacker % 4;
        defender = defender % 4;
        uint16 bps = TypeChart.effectiveness(attacker, defender);
        assertTrue(
            bps == TypeChart.NORMAL_BPS ||
            bps == TypeChart.SUPER_BPS ||
            bps == TypeChart.RESISTED_BPS,
            "only NORMAL/SUPER/RESISTED allowed"
        );
    }
}
