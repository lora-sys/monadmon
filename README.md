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

| Element | Common (50%) | Common (50%) | Common (50%) | Rare (30%) | Rare (30%) | Legendary (20%) |
|---|---|---|---|---|---|---|
| 🔥 **Fire** | EmberFox | MagmaTurtle | AquaPup | FlameBird | — | — |
| 💧 **Water** | — | AquaPup | BubbleFish | — | ForestDeer | OceanDragon |
| 🌱 **Nature** | LeafRabbit | MossGolem | — | — | — | — |
| ⚡ **Electric** | VoltCat | SparkMouse | — | ThunderWolf | — | — |

*Each species hatches at stage 1 and evolves to stage 2 at Lv 20, then stage 3 at Lv 40. Stage 0 is the egg.*

---

## Full evolution: all 12 species × 4 stages

Every Monster goes through the same life cycle. The four stages show
the visual progression from unhatched egg → juvenile → evolved form
→ ascended form. Each species has its own unique look at every stage.

### Fire

<table>
<tr>
  <th align="center">EmberFox</th>
  <td align="center"><img src="frontend/public/assets/monsters/1/stage0.png" width="100"/><br/>egg</td>
  <td align="center"><img src="frontend/public/assets/monsters/1/stage1.png" width="100"/><br/>EmberFox</td>
  <td align="center"><img src="frontend/public/assets/monsters/1/stage2.png" width="100"/><br/>FlameFox</td>
  <td align="center"><img src="frontend/public/assets/monsters/1/stage3.png" width="100"/><br/>InfernoFox</td>
</tr>
<tr>
  <th align="center">MagmaTurtle</th>
  <td align="center"><img src="frontend/public/assets/monsters/2/stage0.png" width="100"/><br/>egg</td>
  <td align="center"><img src="frontend/public/assets/monsters/2/stage1.png" width="100"/><br/>MagmaTurtle</td>
  <td align="center"><img src="frontend/public/assets/monsters/2/stage2.png" width="100"/><br/>LavaTurtle</td>
  <td align="center"><img src="frontend/public/assets/monsters/2/stage3.png" width="100"/><br/>VolcanoTurtle</td>
</tr>
<tr>
  <th align="center">FlameBird</th>
  <td align="center"><img src="frontend/public/assets/monsters/3/stage0.png" width="100"/><br/>egg</td>
  <td align="center"><img src="frontend/public/assets/monsters/3/stage1.png" width="100"/><br/>FlameBird</td>
  <td align="center"><img src="frontend/public/assets/monsters/3/stage2.png" width="100"/><br/>Phoenix</td>
  <td align="center"><img src="frontend/public/assets/monsters/3/stage3.png" width="100"/><br/>SunPhoenix</td>
</tr>
</table>

### Water

<table>
<tr>
  <th align="center">AquaPup</th>
  <td align="center"><img src="frontend/public/assets/monsters/4/stage0.png" width="100"/><br/>egg</td>
  <td align="center"><img src="frontend/public/assets/monsters/4/stage1.png" width="100"/><br/>AquaPup</td>
  <td align="center"><img src="frontend/public/assets/monsters/4/stage2.png" width="100"/><br/>TidalHound</td>
  <td align="center"><img src="frontend/public/assets/monsters/4/stage3.png" width="100"/><br/>OceanWolf</td>
</tr>
<tr>
  <th align="center">BubbleFish</th>
  <td align="center"><img src="frontend/public/assets/monsters/5/stage0.png" width="100"/><br/>egg</td>
  <td align="center"><img src="frontend/public/assets/monsters/5/stage1.png" width="100"/><br/>BubbleFish</td>
  <td align="center"><img src="frontend/public/assets/monsters/5/stage2.png" width="100"/><br/>CoralGiant</td>
  <td align="center"><img src="frontend/public/assets/monsters/5/stage3.png" width="100"/><br/>ReefTitan</td>
</tr>
<tr>
  <th align="center">OceanDragon</th>
  <td align="center"><img src="frontend/public/assets/monsters/6/stage0.png" width="100"/><br/>egg</td>
  <td align="center"><img src="frontend/public/assets/monsters/6/stage1.png" width="100"/><br/>OceanDragon</td>
  <td align="center"><img src="frontend/public/assets/monsters/6/stage2.png" width="100"/><br/>TidalWyrm</td>
  <td align="center"><img src="frontend/public/assets/monsters/6/stage3.png" width="100"/><br/>Leviathan</td>
</tr>
</table>

### Nature

<table>
<tr>
  <th align="center">LeafRabbit</th>
  <td align="center"><img src="frontend/public/assets/monsters/7/stage0.png" width="100"/><br/>egg</td>
  <td align="center"><img src="frontend/public/assets/monsters/7/stage1.png" width="100"/><br/>LeafRabbit</td>
  <td align="center"><img src="frontend/public/assets/monsters/7/stage2.png" width="100"/><br/>ForestRabbit</td>
  <td align="center"><img src="frontend/public/assets/monsters/7/stage3.png" width="100"/><br/>EmeraldHare</td>
</tr>
<tr>
  <th align="center">MossGolem</th>
  <td align="center"><img src="frontend/public/assets/monsters/8/stage0.png" width="100"/><br/>egg</td>
  <td align="center"><img src="frontend/public/assets/monsters/8/stage1.png" width="100"/><br/>MossGolem</td>
  <td align="center"><img src="frontend/public/assets/monsters/8/stage2.png" width="100"/><br/>StoneGolem</td>
  <td align="center"><img src="frontend/public/assets/monsters/8/stage3.png" width="100"/><br/>AncientGrove</td>
</tr>
<tr>
  <th align="center">ForestDeer</th>
  <td align="center"><img src="frontend/public/assets/monsters/9/stage0.png" width="100"/><br/>egg</td>
  <td align="center"><img src="frontend/public/assets/monsters/9/stage1.png" width="100"/><br/>ForestDeer</td>
  <td align="center"><img src="frontend/public/assets/monsters/9/stage2.png" width="100"/><br/>PrimalStag</td>
  <td align="center"><img src="frontend/public/assets/monsters/9/stage3.png" width="100"/><br/>WorldTree</td>
</tr>
</table>

### Electric

<table>
<tr>
  <th align="center">VoltCat</th>
  <td align="center"><img src="frontend/public/assets/monsters/10/stage0.png" width="100"/><br/>egg</td>
  <td align="center"><img src="frontend/public/assets/monsters/10/stage1.png" width="100"/><br/>VoltCat</td>
  <td align="center"><img src="frontend/public/assets/monsters/10/stage2.png" width="100"/><br/>StormCat</td>
  <td align="center"><img src="frontend/assets/monsters/10/stage3.png" width="100"/><br/>ThunderTiger</td>
</tr>
<tr>
  <th align="center">SparkMouse</th>
  <td align="center"><img src="frontend/public/assets/monsters/11/stage0.png" width="100"/><br/>egg</td>
  <td align="center"><img src="frontend/public/assets/monsters/11/stage1.png" width="100"/><br/>SparkMouse</td>
  <td align="center"><img src="frontend/public/assets/monsters/11/stage2.png" width="100"/><br/>BoltRat</td>
  <td align="center"><img src="frontend/public/assets/monsters/11/stage3.png" width="100"/><br/>LightningSage</td>
</tr>
<tr>
  <th align="center">ThunderWolf</th>
  <td align="center"><img src="frontend/public/assets/monsters/12/stage0.png" width="100"/><br/>egg</td>
  <td align="center"><img src="frontend/public/assets/monsters/12/stage1.png" width="100"/><br/>ThunderWolf</td>
  <td align="center"><img src="frontend/public/assets/monsters/12/stage2.png" width="100"/><br/>StormfangAlpha</td>
  <td align="center"><img src="frontend/public/assets/monsters/12/stage3.png" width="100"/><br/>ThunderDeity</td>
</tr>
</table>

---

## How a round plays

```
Connect wallet  →  Mint Egg (1 per wallet)
       ↓
   Hatch Egg  →  Species + DNA + stats (on-chain, from prevrandao)
       ↓
   Train      →  +30 XP, +2 ATK per session (6h cooldown)
       ↓
  Level up    →  Stage 2 at Lv 20, Stage 3 at Lv 40
       ↓
   Battle     →  Pick opponent, accept, deterministic formula resolves on-chain
       ↓
  Leaderboard →  Ranked by wins (live indexer)
```

### Battle formula (deterministic)
For each turn: pick the faster monster, compute damage = `ATK * effectiveness * random(0.85-1.15) * crit(1.5x with 12% chance)`, then `damage *= (1 - DEF/(DEF+200))`. First to 0 HP loses. 50-turn cap → draw.

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
| CI | GitHub Actions: forge fmt + test, npm typecheck + lint + build |
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
- ✅ 9 PRs merged, each with adversarial review
- ✅ CI green on every push
- ✅ Local Anvil end-to-end proven (cast + 7 agent-browser screenshots)
- ⏳ Testnet deploy pending user-funded wallet ([#24](https://github.com/lora-sys/monadmon/issues/24))

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for the full table.

## License

MIT — see [LICENSE](./LICENSE).
