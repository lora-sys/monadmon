# MonadMon Demo Script

> 5-minute walkthrough of the MVP on Monad testnet (or local Anvil).

## Pre-flight
- **Browser:** Chrome / Firefox / Brave with a wallet extension (MetaMask or Rabby).
- **Wallet:** A funded Monad testnet wallet. Get MON from the [Monad faucet](https://faucet.monad.xyz).
- **RPC:** Add Monad testnet to your wallet:
  - Network name: `Monad Testnet`
  - RPC URL: `https://testnet-rpc.monad.xyz`
  - Chain ID: `10143`
  - Currency symbol: `MON`

## Demo flow (5 minutes)

### Step 1 — Visit the site (10 s)
Open `https://monadmon.vercel.app` (placeholder; for local dev use `http://localhost:3001`).

You should see the landing page: "The first living creatures on Monad" with a "Mint my Genesis Egg" button.

### Step 2 — Connect Wallet (15 s)
Click **Connect Wallet** in the top-right. Pick MetaMask / Rabby. Approve the connection. If prompted to switch networks, switch to Monad Testnet.

The header now shows your truncated address (e.g. `0xf39F…2266`).

### Step 3 — Mint a Genesis Egg (30 s)
Click **Mint** in the header nav. The mint page shows an egg illustration.

Click **Mint Egg**. Approve the transaction in your wallet. Wait for confirmation (~1 s on Monad).

You now own a Genesis Egg (tokenId 1).

### Step 4 — Hatch the Egg (30 s)
Click **Hatch**. The egg animation plays (scale + rotate + opacity). Approve the transaction.

The hatch reveals your Monster:
- **Species** (one of 12, picked from a 50/30/20 rarity band)
- **DNA** (64-bit hash, deterministic from your address + tokenId)
- **Stats** (HP / ATK / DEF / SPD, within ±10% of species base)

The page redirects to your Monster's detail page.

### Step 5 — View your Monster (15 s)
On the monster detail page you see:
- Large monster art
- Type badge (Fire / Water / Nature / Electric)
- Rarity badge (Common / Rare / Legendary)
- HP / ATK / DEF / SPD stats
- Level + XP bar
- DNA hex
- Battles won / lost

### Step 6 — Train (15 s)
Click **Train**. Wait 6 hours... or just wait a few seconds on Anvil.

Each train grants +30 XP and +2 ATK. After enough training, your Monster levels up (XP threshold = level × 100).

### Step 7 — Battle another player (60 s)
Open the **Arena**. Fill in:
- Your tokenId: `1`
- Opponent address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` (a test wallet)
- Opponent tokenId: `2`

Click **Challenge**. The opponent accepts from their wallet.

The battle resolves deterministically on-chain:
- Speed decides turn order
- Type effectiveness: Fire > Nature > Water > Electric > Fire
- Damage = ATK × effectiveness × random(0.85-1.15) × crit(12%)
- Winner gets +50 XP and a `battlesWon++`

The arena now shows the resolved challenge.

### Step 8 — Leaderboard (10 s)
Visit `/leaderboard`. Top trainers ranked by battles won. (Phase 2 swaps in a live indexer.)

### Step 9 — Showcase profile (10 s)
Visit `/profile/<your-address>`. Shows your public monster collection.

## What's next
- **Polishing:** Art pipeline completes over time (Pollinations batch).
- **Phase 2:** Marketplace, items, exploration, guilds, tournaments.
- **Mainnet:** After a security audit.

## Local dev (Anvil)
```bash
# Terminal 1 — contracts
cd contracts
forge install OpenZeppelin/openzeppelin-contracts@v5.1.0 --no-git
forge test  # 37 tests
DEPLOYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast

# Terminal 2 — frontend
cd frontend
cp .env.local.example .env.local
# fill the three NEXT_PUBLIC_*_ADDRESS lines from the deploy output above
pnpm install
pnpm dev  # http://localhost:3001
```

## Architecture in 30 seconds
- **Contracts:** Solidity 0.8.24 + OpenZeppelin v5 + Foundry. Deployed at `MonsterNFT` (ERC-721), `ItemNFT` (ERC-1155 scaffold), `GenesisMinter` (wrapper), `Battle` (PvP), `BlockPrevRandaoSource` (RNG).
- **Frontend:** Next.js 14 App Router + TypeScript + wagmi v2 + viem v2 + RainbowKit v2 + Tailwind + framer-motion.
- **Art:** Pollinations.ai `flux` model, zero API key, deterministic seeds.
- **RNG:** `block.prevrandao` (swappable for VRF when available on Monad).
