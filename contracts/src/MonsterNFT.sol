// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title MonsterNFT
/// @notice MonadMon creature NFT. Phase-1 placeholder. Full logic lands in
///         ISSUE-0004 (storage + mintGenesis), ISSUE-0006 (hatch), ISSUE-0010 (battle integration).
/// @dev    Storage layout declared here so future PRs extend it in place.
///         OZ inheritance (ISSUE-0004) adds mint/transfer hooks around the
///         same struct without changing per-token layout.
contract MonsterNFT {
    /// @notice Per-token monster state. Packs into 2 storage slots.
    ///         Field order is locked here; future PRs must append, not reorder.
    struct Monster {
        // Slot 0, bytes 0..31
        uint16 speciesId; // 0 = unhatched egg; 1..12 = species catalog index
        uint16 level; // starts at 1
        uint32 xp; // cumulative experience
        uint8 stage; // 0..3 evolution stage
        uint8 _reserved0; // future use, do not read
        uint16 _reserved1; // future use, do not read
        uint64 dna; // 64-bit individual trait hash, derived at hatch
        uint16 hp;
        uint16 atk;
        uint16 def;
        uint16 spd;
        // Slot 1, bytes 0..15
        uint64 lastTrainedAt; // unix seconds of last training action
        uint16 battlesWon;
        uint16 battlesLost;
        // Slot 1 ends at byte 12; remaining 20 bytes are free for future fields
        // without breaking the storage layout.
    }

    /// @dev Private mapping. Read via getMonster(). Writes happen via mint
    ///      (ISSUE-0004), hatch (ISSUE-0006), train (later), and battle (ISSUE-0010).
    mapping(uint256 tokenId => Monster) private _monsters;

    string public name = "MonadMon";
    string public symbol = "MONMON";

    /// @notice Returns the full Monster struct for a token.
    function getMonster(uint256 tokenId) external view returns (Monster memory) {
        return _monsters[tokenId];
    }

    /// @notice Storage slot helper used by future versions to compute offsets
    ///         deterministically (e.g. for diamond-pattern facet tests).
    function monsterSlot(uint256 tokenId) external pure returns (bytes32) {
        return keccak256(abi.encode(tokenId, uint256(0)));
    }
}
