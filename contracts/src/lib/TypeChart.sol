// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title TypeChart
/// @notice Pure type effectiveness matrix for MonadMon. Element ids:
///         0 = Fire, 1 = Water, 2 = Nature, 3 = Electric.
///         Multiplier is encoded in basis points (10_000 = 1.0x).
///
/// @dev    Cycle: Fire → Nature → Water → Electric → Fire (clockwise).
///         Attacker column header is the attacker element; row is defender.
library TypeChart {
    uint8 internal constant FIRE = 0;
    uint8 internal constant WATER = 1;
    uint8 internal constant NATURE = 2;
    uint8 internal constant ELECTRIC = 3;

    uint16 internal constant NORMAL_BPS = 10_000; // 1.0x
    uint16 internal constant SUPER_BPS = 15_000; // 1.5x
    uint16 internal constant RESISTED_BPS = 5_000; // 0.5x

    /// @notice Returns the effectiveness (in BPS) of `attacker` element vs
    ///         `defender` element. Out-of-range element ids revert.
    function effectiveness(uint8 attacker, uint8 defender) internal pure returns (uint16) {
        require(attacker <= 3 && defender <= 3, "TypeChart: bad element");
        if (attacker == defender) return NORMAL_BPS;
        // Fire super-effective vs Nature; Fire resisted by Water.
        if (attacker == FIRE && defender == NATURE) return SUPER_BPS;
        if (attacker == FIRE && defender == WATER) return RESISTED_BPS;
        // Water super-effective vs Fire; Water resisted by Electric.
        if (attacker == WATER && defender == FIRE) return SUPER_BPS;
        if (attacker == WATER && defender == ELECTRIC) return RESISTED_BPS;
        // Nature super-effective vs Water; Nature resisted by Fire.
        if (attacker == NATURE && defender == WATER) return SUPER_BPS;
        if (attacker == NATURE && defender == FIRE) return RESISTED_BPS;
        // Electric super-effective vs Water; Electric resisted by Nature.
        if (attacker == ELECTRIC && defender == WATER) return SUPER_BPS;
        if (attacker == ELECTRIC && defender == NATURE) return RESISTED_BPS;
        // Water weak to Nature: N beats W, so W atk vs N def is resisted.
        if (attacker == WATER && defender == NATURE) return RESISTED_BPS;
        return NORMAL_BPS;
    }
}
