# MonadMon

> **The first living creatures on Monad.**
> Catch them. Train them. Battle them. Yours forever.

MonadMon is a fully on-chain creature-raising + PvP battle game on the Monad testnet.
Each player mints a Genesis Egg, hatches it into one of 12 species (50/30/20 Common/Rare/Legendary),
trains + evolves it, and battles other players — all with verifiable state on Monad.

<table>
<tr>
  <td rowspan="4" width="60%"><img src="frontend/public/assets/monsters/1/stage3.png" alt="EmberFox stage 3 — InfernoFox, the ascended form" width="100%"/></td>
  <td align="center" width="20%"><img src="frontend/public/assets/monsters/6/stage3.png" alt="OceanDragon stage 3 — Leviathan" width="100%"/><br/><sub>🔥 Fire</sub></td>
</tr>
<tr><td align="center"><img src="frontend/public/assets/monsters/6/stage3.png" alt="Water" width="100%"/><br/><sub>💧 Water</sub></td></tr>
<tr><td align="center"><img src="frontend/public/assets/monsters/9/stage3.png" alt="Nature" width="100%"/><br/><sub>🌱 Nature</sub></td></tr>
<tr><td align="center"><img src="frontend/public/assets/monsters/12/stage3.png" alt="Electric" width="100%"/><br/><sub>⚡ Electric</sub></td></tr>
</table>

---

## The 12 species

Four elements, three species each. Rarity comes from a deterministic on-chain RNG
(`block.prevrandao + tokenId + msg.sender`); the same inputs always hatch the same monster.

| Element | Common (50%) | Common (50%) | Common (50%) | Rare (30%) | Rare (30%) | Legendary (20%) |
|---|---|---|---|---|---|---|
| 🔥 **Fire** | EmberFox | MagmaTurtle | — | FlameBird | — | — |
| 💧 **Water** | AquaPup | BubbleFish | — | — | — | OceanDragon |
| 🌱 **Nature** | LeafRabbit | MossGolem | — | — | ForestDeer | — |
| ⚡ **Electric** | VoltCat | SparkMouse | — | ThunderWolf | — | — |

*Each species hatches at stage 1 and evolves to stage 2 at Lv 20, then stage 3 at Lv 40. Stage 0 is the egg.*

---

## Species codex

Each species has a distinct habitat, personality, and three signature moves used in
the on-chain battle formula. The codex is the source of truth for the in-game
collection view.

### Fire

#### EmberFox · Common · stage 1 = juvenile · stage 2 = FlameFox · stage 3 = InfernoFox
![EmberFox stage 1](frontend/public/assets/monsters/1/stage1.png)

- **Habitat:** Volcanic cliffs and lava rivers of the Burning Peaks.
- **Personality:** Hot-headed but fiercely loyal. Curiosity always outpaces caution.
- **Moves:** *Flame Tail* (physical, +ATK) · *Lava Burst* (special, sets 2-turn burn) · *Ember Charge* (status, +1 SPD).

#### MagmaTurtle · Common · stage 2 = LavaTurtle · stage 3 = VolcanoTurtle
![MagmaTurtle stage 1](frontend/public/assets/monsters/2/stage1.png)

- **Habitat:** Sulfur springs deep in the Emberwilds.
- **Personality:** Patient and slow-burning. Carries the weight of the earth on its back.
- **Moves:** *Magma Shell* (status, halves damage taken for 2 turns) · *Eruption* (special, ignores 30% of target's DEF) · *Stoneskin* (status, +1 DEF).

#### FlameBird · Rare · stage 2 = Phoenix · stage 3 = SunPhoenix
![FlameBird stage 1](frontend/public/assets/monsters/3/stage1.png)

- **Habitat:** High-altitude thermal updrafts above the Sacred Volcano.
- **Personality:** Playful and quick, but fiercely territorial about the sky.
- **Moves:** *Sky Dive* (physical, +1 crit) · *Flame Wing* (special, hits all enemies in a line) · *Searing Peck* (physical, +20% if target is burned).

### Water

#### AquaPup · Common · stage 2 = TidalHound · stage 3 = OceanWolf
![AquaPup stage 1](frontend/public/assets/monsters/4/stage1.png)

- **Habitat:** Shallow tide pools and warm reefs along the Singing Coast.
- **Personality:** Loyal, eager, always looking up at you with bright eyes.
- **Moves:** *Aqua Howl* (status, +1 ATK to all allies) · *Tidal Wave* (special, hits all enemies) · *Water Pulse* (physical, +10% damage if target is wet).

#### BubbleFish · Common · stage 2 = CoralGiant · stage 3 = ReefTitan
![BubbleFish stage 1](frontend/public/assets/monsters/5/stage1.png)

- **Habitat:** Coral reefs and warm tropical currents.
- **Personality:** Cheerful and round, pops out a wall of bubbles when startled.
- **Moves:** *Bubble Shield* (status, +2 DEF) · *Aqua Jet* (physical, ignores 25% of target's DEF) · *Pressure Cannon* (special, +30% damage at low HP).

#### OceanDragon · Legendary · stage 2 = TidalWyrm · stage 3 = Leviathan
![OceanDragon stage 1](frontend/public/assets/monsters/6/stage1.png)

- **Habitat:** The deep abyss where light cannot reach.
- **Personality:** Slow to anger, devastating once roused. Ancient beyond measure.
- **Moves:** *Tidal Crush* (physical, +1.5× vs targets below 50% HP) · *Abyssal Roar* (status, lowers target ATK by 1 for 2 turns) · *Leviathan Wave* (special, hits all enemies, ignores type effectiveness).

### Nature

#### LeafRabbit · Common · stage 2 = ForestRabbit · stage 3 = EmeraldHare
![LeafRabbit stage 1](frontend/public/assets/monsters/7/stage1.png)

- **Habitat:** Sun-dappled forest meadows and clearings.
- **Personality:** Skittish but social, hops between friends and always shares what it finds.
- **Moves:** *Leaf Heal* (status, restores 25% HP) · *Hop Kick* (physical, +1 crit) · *Clover Toss* (special, 10% chance to inflict sleep).

#### MossGolem · Common · stage 2 = StoneGolem · stage 3 = AncientGrove
![MossGolem stage 1](frontend/public/assets/monsters/8/stage1.png)

- **Habitat:** Old-growth forests covered in centuries of moss.
- **Personality:** Slow to befriend, but unshakeable once trusted. Carries an entire grove on its back.
- **Moves:** *Moss Wall* (status, +2 DEF for 2 turns) · *Vine Bind* (special, target SPD -1 for 2 turns) · *Ancient Grasp* (physical, ignores 50% of target's DEF).

#### ForestDeer · Rare · stage 2 = PrimalStag · stage 3 = WorldTree
![ForestDeer stage 1](frontend/public/assets/monsters/9/stage1.png)

- **Habitat:** Deep forest clearings where sunlight breaks through.
- **Personality:** Swift and graceful, with antlers that channel nature's will.
- **Moves:** *Forest Step* (status, +1 SPD, +1 EVA) · *Antler Charge* (physical, +25% damage if target attacked first) · *World Tree Blessing* (status, heals 5% HP per turn for 3 turns).

### Electric

#### VoltCat · Common · stage 2 = StormCat · stage 3 = ThunderTiger
![VoltCat stage 1](frontend/public/assets/monsters/10/stage1.png)

- **Habitat:** Power stations and high-voltage transmission corridors.
- **Personality:** Sleek, aloof, and always on its own path. Sparks at the slightest touch.
- **Moves:** *Volt Bolt* (physical, 15% chance to paralyze for 1 turn) · *Static Claw* (physical, deals bonus damage to wet targets) · *Thunder Dash* (status, +2 SPD for 2 turns).

#### SparkMouse · Common · stage 2 = BoltRat · stage 3 = LightningSage
![SparkMouse stage 1](frontend/public/assets/monsters/11/stage1.png)

- **Habitat:** Junction boxes and old server rooms.
- **Personality:** Small, twitchy, surprisingly fast. Lives on crumbs and electricity.
- **Moves:** *Spark Bite* (physical, hits twice with 60% power each) · *Wire Trap* (status, target SPD -1 for 2 turns) · *Voltage Tongue* (special, 20% chance to inflict shock).

#### ThunderWolf · Rare · stage 2 = StormfangAlpha · stage 3 = ThunderDeity
![ThunderWolf stage 1](frontend/public/assets/monsters/12/stage1.png)

- **Habitat:** Stormy mountaintops under perpetual lightning.
- **Personality:** Lone wolf, fiercely independent. Commands the very sky.
- **Moves:** *Thunder Howl* (status, +1 ATK to all allies) · *Lightning Fang* (physical, crit rate +15%) · *Stormfang Strike* (special, +1.5× vs targets in rain/lightning).

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
  <td align="center"><img src="frontend/public/assets/monsters/10/stage3.png" width="100"/><br/>ThunderTiger</td>
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
See [README.zh.md](./README.zh.md) for the Chinese version.

## License

MIT — see [LICENSE](./LICENSE).
