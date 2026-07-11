# Review Report — ISSUE-0001 (Foundry workspace init + MonsterNFT stub)

Reviewers (acting as a coordinated panel): **bug-hunter**, **architecture-reviewer**, **security-reviewer** (advisory).

## Verdict
**APPROVE with one Critical finding (fixed before merge) + three Medium/Low notes.**

## Critical (fixed)
- **C-1 — `monsters()` function shadows the planned public mapping.** The placeholder shipped `function monsters(uint256) pure returns (Monster memory)` which would have collided with `mapping(uint256 => Monster) public monsters` in ISSUE-0004. Fixed by switching to `mapping(uint256 => Monster) private _monsters` plus an explicit `getMonster(uint256) returns (Monster memory)` getter. The struct layout itself is unchanged, so ISSUE-0004 still composes cleanly.

## Medium (fixed)
- **M-1 — Slot-count comment was wrong.** The original comment claimed "packs into 6 storage slots". The struct actually fits in **2 slots** (slot 0 packs all numeric fields into 32 bytes; slot 1 packs lastTrainedAt + battlesWon + battlesLost into 12 bytes, leaving 20 bytes free for future fields). Comment corrected.
- **M-2 — Padding fields were confusingly named.** Renamed `_padding0/1` to `_reserved0/1` and added a note that they are reserved for future use and must not be read.

## Low (acknowledged, tracked)
- **L-1 — `auto_detect_solc = true` is redundant** when `solc_version = "0.8.24"` is pinned. Kept; harmless.
- **L-2 — `name` and `symbol` as `public` state** cost gas on first SLOAD per tx. Acceptable for MVP; Phase 2 may move to `immutable` once the constructor signature is locked.
- **L-3 — No CI workflow yet.** Tracked as ISSUE-0016 (to be filed).

## Security (advisory, no findings)
- No auth, no randomness, no payment, no external calls in this PR. Not applicable.

## Test coverage
4 tests, all passing. New round-trip test writes the entire struct via `vm.store` and reads it back via `getMonster`, verifying every field's bit position. Future refactors of the struct layout must keep this test green.

## Recommendation
Merge to `main`. Future contract PRs (0004, 0006, 0010) may now extend MonsterNFT in place without storage-layout changes.
