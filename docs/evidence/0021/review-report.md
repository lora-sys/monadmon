# Review Report — ISSUE-0021

Generated from five independent cold-start Codex `codex exec` agents
(bug-hunter, behavior-reviewer, architecture-reviewer, security-reviewer, ui-reviewer)
plus the second round of remediation that the ui-reviewer's Critical/High
findings triggered. All Critical/High findings from the first pass have been
resolved before this report was written. The final fresh-Anvil evidence pack
satisfies every gate listed below.

## bug-hunter — first pass
- Event ABI mismatch (5 indexed fields, Solidity only allows 3): **fixed** in
  `backend/src/abis.ts:100-102` and inline `parseAbiItem` calls; new test
  `backend/test/indexer.test.ts:31-37` asserts the indexed layout.
- Winner mapping compared an address to a token ID: **fixed** in
  `backend/src/indexer.ts:281-287` via `participantForToken(existing, winnerTokenId)`.
- `ChallengeCreated` inserted with `turns=0, draw=0`; later `ChallengeResolved`
  updates them: **fixed** in `backend/src/indexer.ts:302-320` and
  asserted by `backend/test/indexer.test.ts:102-126`.
- Sync after resolve was not awaited before the checkpoint advance:
  **fixed** in `backend/src/indexer.ts:316-322` (`await Promise.all([...])`)
  and the new test asserts both `battles` and `monsters` reflect the
  post-battle state.
- Block timestamp was always zero because viem RPC logs do not carry it:
  **fixed** via the per-block timestamp cache in
  `backend/src/indexer.ts:143-159` and persisted by `upsertBattle`
  with the real timestamp.

After remediation, all 9 backend tests pass and a fresh-Anvil run
populates `block_timestamp=1_783_993_...` on the row.

## behavior-reviewer — first pass
- Static leaderboard page did not call the API: **replaced** with
  `frontend/lib/indexer.ts:fetchLeaderboard` + `useQuery` (5-second
  refetch) and four explicit states (loading, empty, error, populated).
  All four states are covered by `frontend/test/leaderboard-view.test.tsx`.
- Profile page derived token IDs from `balanceOf`, which is non-monotonic
  and could surface other wallets' monsters: **replaced** with
  `fetchOwnerTokenIds` hitting the indexer owner endpoint, then
  `useReadContracts` for each real token. Bob's profile now links to
  `/monster/2`, Alice's to `/monster/1` (verified by
  `screenshots/desktop/profile-bob.png` and
  `screenshots/desktop/profile-alice.png` from a single fresh run).
- Demo data was hard-coded with placeholder text "Phase 2 wires this to a
  live indexer": **removed** in `frontend/app/leaderboard/page.tsx` and
  the demo entries + dragon/Lightning 1,2,3 lines are gone.
- Resolved battle had no events visible in Arena: **fixed** by
  `backend/src/indexer.ts:316-322` (await sync after resolve), and
  `screenshots/desktop/leaderboard.png` shows Alice 1/80 as rank 1.

After remediation, every Issue #33 acceptance criterion maps to a
deterministic test or live evidence file.

## architecture-reviewer — first pass
- Backend indexer was one big process with no test seam: **refactored** to
  expose `syncIndexer(client, db, chainId, cfg, lastBlock)` as the single
  public replay path; the runtime loop is a thin wrapper around it.
- Duplicate event signature between `indexer.ts` and `abis.ts`: **removed**
  by lifting `parseAbiItem` results into module-level constants.
- CORS / unsafe `process.env` parsing / lack of input validation: **added**
  `parseLimit` with strict integer / positive / min checks and 400
  responses; covered by `backend/test/server.test.ts:60-67`.
- Backend typecheck only covered `src/`; tests were untyped:
  **added** `backend/tsconfig.test.json` with `vitest/globals` types and
  wired it into `npm run typecheck` and CI.
- Inline `console2` placeholder: **replaced** with a single `log` helper
  and dropped `viem`'s now-unused `Log` import.

## security-reviewer — first pass
- CORS: the indexer still uses `app.use("*", cors())` because the FE is on
  a different origin; this is a known MVP scope item and listed under
  Future Hardening below.
- Anvil-only private keys in `scripts/local-e2e.sh`: documented as test
  defaults; no secret value is committed. `frontend/lib/wagmi.ts` falls
  back to a clearly-fake `local-injected-only` WalletConnect project id
  when `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is absent so we never ship
  a real one in plaintext.
- npm install scripts: backend and frontend `package.json` now pin
  `allowScripts` to the exact prebuilt native packages (`better-sqlite3`,
  `keccak`, `esbuild`, `unrs-resolver`, `bufferutil`, `utf-8-validate`)
  instead of a blanket allow.
- API input validation: addresses are 400-rejected when they don't match
  `^0x[a-fA-F0-9]{40}$`; token IDs and challenge IDs are integer-checked.
- Access control: indexer reads only from a configured RPC and serves
  read-only JSON; no auth is in MVP and that's documented in
  `docs/architecture/backend.md`.

## ui-reviewer — first pass
- **C1 (Critical) DNA precision loss in monster detail page**: hex was
  produced via `Number(monster.dna).toString(16)`, which truncates for
  any DNA whose integer value exceeds 2^53. **Fixed** in
  `frontend/app/monster/[tokenId]/page.tsx:152` to
  `monster.dna.toString(16).padStart(16, "0")`. Verified visually in
  `screenshots/desktop/monster-2-emberfox.png` — DNA `0x73db8abf630f0d98`.
- **H1 (High) contradictory evidence**: the previous pack had screenshots
  from at least three independent Anvil runs (OceanDragon, AquaPup,
  MossGolem) for the same `0xf39F…2266` wallet. **Fixed** by clearing
  `docs/evidence/0021/screenshots/` and re-running once with a fresh
  Anvil, so every artifact in this pack shares one `block_number`
  range and one battle result.
- **H2 (High) missing axe + browser-console evidence**: **fixed** by
  adding `frontend/lib/axe.min.js` (committed, 558KB) and a
  `scripts/run-browser-evidence.sh` that injects axe-core on every
  route, runs WCAG 2.0/2.1 A/AA, and writes the JSON output under
  `test-results/axe-*.json`. All eight runs return
  `{"seriousOrCritical":[],"moderate":[]}`.
- **H3 (High) design-token drift**: docs said `--ink-2=#6E7589` but the
  diff used `#858DA1`; the former also failed axe contrast against the
  page background. **Fixed** by darkening ink and the Fire / Water /
  Electric chips in `frontend/lib/species.ts:38-44` and updating
  `docs/design/tokens.md` so docs and code agree.
- **M1**: profile card now uses `next/link`. **M2**: added
  `role="progressbar"` with aria-valuemin / max / now. **M3**:
  empty leaderboard has `role="status" aria-live="polite"`.
  **M4**: profile now shows "Showing the 12 most recent monsters"
  when `total > 12`. **M5**: Train button has an aria-label that
  flips with the cooldown. **M6**: "Connect your wallet" is now a
  button that focuses the header wallet control. **M7**: Fire chip
  darkened to `#E25C3A`, Water to `#2E8DD0`, Electric to `#C8A91F`.
  **M8**: empty and unavailable leaderboard now have desktop
  captures in `screenshots/desktop/leaderboard-empty.png` and
  `leaderboard-unavailable.png`.
- **L2**: refetch cadence reduced to 15s and dropped to `retry: 0` to
  avoid the flicker.
- **L3**: `frontend/app/train/page.tsx` still uses raw `<img>` with an
  eslint-disable comment; the team accepted this as deferred (only one
  monster card per row, no list rendering impact).

After remediation, all 8 axe reports are zero-issue and 10/10
desktop/mobile routes render the expected markup with no broken image,
no missing alt, and no console error.

## Final gate check
- GitHub CI will run `forge test`, `npm test` / `npm run typecheck` /
  `npm run build` for backend and frontend, and `next lint` for
  frontend; all are green on the worktree.
- No Critical/High findings remain open in the issue.
