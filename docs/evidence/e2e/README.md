# E2E Walkthrough (Local Anvil)

This directory contains screenshots from a full local-development walkthrough
of the MonadMon MVP: anvil + contracts + indexer + Next.js dev server.

## Flow executed
1. `anvil --port 8545` (chain id 31337)
2. `forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast`
   - Deploys MonsterNFT, GenesisMinter, Battle, BlockPrevRandaoSource, ItemNFT
3. `npm run dev` (port 3001, dark mode)
4. Two E2E rounds on chain:
   - Round A: Alice mints + hatches + trains; Bob mints + hatches + wins 1 battle
   - Round B: re-mint under fresh anvil to capture every UI state
5. `node backend/dist/index.js` (port 3002)
   - Subscribes to EggMinted, MonsterHatched, Trained, ChallengeCreated,
     ChallengeResolved
6. Hit each FE page with agent-browser; the screenshot below shows the
   live AquaPup / MagmaTurtle data coming through from the contracts.

## Screenshots
- `00-landing.png` — landing page with the InfernoFox hero
- `01-landing.png` — same
- `02-mint.png` — mint page (wallet not connected in this headless test)
- `02-train.png` — train page
- `02-arena.png` — battle arena with create-challenge form
- `02-leaderboard.png` — leaderboard
- `03-monster-detail-alice.png` — Alice's AquaPup with live on-chain data
  (level 1, XP 30, HP 157, ATK 131, DEF 76, SPD 227)
- `04-monster-detail-bob.png` — Bob's MagmaTurtle (level 1, XP 50, 1 loss)
- `05-arena.png` — arena after a challenge
- `06-leaderboard.png` — leaderboard (still shows demo data because no
  resolved battles on this anvil instance)

## Known issues
- **ChallengeCreated has 5 indexed args** (Solidity allows max 3).
  This means the 4th and 5th (challengerTokenId, opponentTokenId) end
  up in the data field. viem's auto-decoded log.args has the wrong
  values for the unindexed ones. Fixed in the indexer by reading them
  straight from `log.data` (see the `data.slice(0, 64)` block).
- **Anvil state is volatile** — every restart wipes all monsters,
  mints, battles, balances. Use a real testnet for the persistent demo.
- **CI is sandbox-sensitive** — a `pnpm install --frozen-lockfile` against
  the regenerated `package-lock.json` works locally and the
  npm-lockfile-based `ci.yml` is green on GitHub.
