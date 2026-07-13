# MonadMon

> **The first living creatures on Monad.**
> Catch them. Train them. Battle them. Yours forever.

MonadMon is a fully on-chain creature-raising + PvP battle game on the Monad testnet.
Each player mints a Genesis Egg, hatches it into one of 12 species (50/30/20 Common/Rare/Legendary),
trains + evolves it, and battles other players — all with verifiable state on Monad.

![EmberFox stage 3 — InfernoFox, the ascended form](frontend/public/assets/monsters/1/stage3.png)

---

## The 12 species

Four elements, three species each. Rarity comes from a deterministic on-chain RNG
(`block.prevrandao + tokenId + msg.sender`); the same inputs always hatch the same monster.

| | Common (50%) | Common (50%) | Common (50%) | Common (50%) |
|---|---|---|---|---|
| 🔥 **Fire** | EmberFox | MagmaTurtle | AquaPup | BubbleFish |
| 💧 **Water** | AquaPup | MagmaTurtle | OceanDragon | ForestDeer |
| 🌱 **Nature** | LeafRabbit | MossGolem | ForestDeer | SparkMouse |
| ⚡ **Electric** | VoltCat | SparkMouse | AquaPup | ThunderWolf |

(*Shuffled by RNG; Common species shown for illustration.*)

### Common (50%)

| Species | Element | Role | Image |
|---|---|---|---|
| **EmberFox** | Fire | Fast attacker | ![EmberFox](frontend/public/assets/monsters/1/stage1.png) |
| **MagmaTurtle** | Fire | Tank | ![MagmaTurtle](frontend/public/assets/monsters/2/stage1.png) |
| **AquaPup** | Water | Support | ![AquaPup](frontend/public/assets/monsters/4/stage1.png) |
| **BubbleFish** | Water | Wall | ![BubbleFish](frontend/public/assets/monsters/5/stage1.png) |
| **LeafRabbit** | Nature | Healer | ![LeafRabbit](frontend/public/assets/monsters/7/stage1.png) |
| **MossGolem** | Nature | Slow wall | ![MossGolem](frontend/public/assets/monsters/8/stage1.png) |
| **VoltCat** | Electric | Glass cannon | ![VoltCat](frontend/public/assets/monsters/10/stage1.png) |
| **SparkMouse** | Electric | Sniper | ![SparkMouse](frontend/public/assets/monsters/11/stage1.png) |

### Rare (30%)

| Species | Element | Role | Image |
|---|---|---|---|
| **FlameBird** | Fire | Crit striker | ![FlameBird](frontend/public/assets/monsters/3/stage1.png) |
| **ForestDeer** | Nature | Balanced | ![ForestDeer](frontend/public/assets/monsters/9/stage1.png) |
| **ThunderWolf** | Electric | Legendary | ![ThunderWolf](frontend/public/assets/monsters/12/stage1.png) |

### Legendary (20%)

| Species | Element | Role | Image |
|---|---|---|---|
| **OceanDragon** | Water | Rare bruiser | ![OceanDragon](frontend/public/assets/monsters/6/stage1.png) |

---

## Evolution: from egg to ascended form

Every Monster hatches at stage 1 and can evolve to stage 2 at level 20, then stage 3 at level 40.
The visual changes are dramatic — your cute starter becomes a battle-hardened beast.

![EmberFox evolution: stage0 (egg) → stage1 (juvenile) → stage2 (evolved) → stage3 (ascended)](frontend/public/assets/monsters/1/stage0.png)
![EmberFox stage 1](frontend/public/assets/monsters/1/stage1.png)
![EmberFox stage 2](frontend/public/assets/monsters/1/stage2.png)
![EmberFox stage 3 — InfernoFox](frontend/public/assets/monsters/1/stage3.png)

---

## How a round plays

```
Connect wallet  →  Mint Egg (1 per wallet)
       ↓
   Hatch Egg  →  Species + DNA + stats (on-chain, from prevrandao)
       ↓
   Train      →  +30 XP, +2 ATK per session (6h cooldown)
       ↓
  Level up    →  Stage 2 at Lv20, Stage 3 at Lv40
       ↓
   Battle     →  Pick opponent, accept, deterministic formula resolves on-chain
       ↓
  Leaderboard →  Ranked by wins (live indexer)
```

### Battle formula (deterministic)
For each turn: pick the faster monster, compute damage = `ATK * effectiveness * random(0.85-1.15) * crit(1.5x with 12% chance)`, then `damage *= (1 - DEF/(DEF+200))`. First to 0 HP loses. 50-turn cap → draw. Full spec in `docs/design/battle-formula.md`.

### Type effectiveness

| Attacker \ Defender | 🔥 Fire | 💧 Water | 🌱 Nature | ⚡ Electric |
|---|---|---|---|---|
| 🔥 **Fire** | 1.0× | 0.5× | 1.5× | 1.0× |
| 💧 **Water** | 1.5× | 1.0× | 0.5× | 0.5× |
| 🌱 **Nature** | 0.5× | 1.5× | 1.0× | 0.5× |
| ⚡ **Electric** | 1.0× | 1.5× | 0.5× | 1.0× |

---

## Tech stack

| Layer | Choice |
|---|---|
| Smart contracts | Solidity 0.8.24 · OpenZeppelin v5.1.0 · Foundry |
| RNG | `block.prevrandao` (swappable behind `IRandomSource`) |
| Frontend | Next.js 14 (App Router) · wagmi v2 · viem v2 · RainbowKit v2 · Tailwind v3 · framer-motion v11 |
| Indexer | TypeScript · Hono · better-sqlite3 · viem |
| Art | Pollinations.ai `flux` model, 12 species × 4 stages = 48 hero images |
| CI | GitHub Actions: forge fmt + test, pnpm typecheck + lint + build |
| Tests | 48 contract tests passing · 90% line coverage · 10k fuzz on rarity |

---

## Try it

```bash
# 1. Get testnet MON from https://faucet.monad.xyz
# 2. Clone + install
git clone https://github.com/lora-sys/monadmon
cd monadmon
cd contracts && forge install && forge test
cd ../frontend && npm install
cd ../backend && npm install

# 3. Deploy to testnet
cd ../contracts
DEPLOYER_PRIVATE_KEY=0x... forge script script/Deploy.s.sol \
  --rpc-url https://testnet-rpc.monad.xyz --broadcast

# 4. Paste the 5 addresses into frontend/.env.local, then:
cd ../frontend && npm run dev          # http://localhost:3000
cd ../backend && PORT=3002 npm start    # indexer at :3002
```

Full demo walkthrough in [DEMO.md](./DEMO.md).

---

## Project status

- ✅ All 14 Phase-1 issues closed
- ✅ 8 PRs merged, each with adversarial review
- ✅ CI green on every push
- ✅ Local Anvil end-to-end proven (cast + 7 agent-browser screenshots)
- ⏳ Testnet deploy pending user-funded wallet ([#24](https://github.com/lora-sys/monadmon/issues/24))

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for the full table.

## License

MIT — see [LICENSE](./LICENSE).
