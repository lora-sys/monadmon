# Monster System — The Critical Design

This is the single most important design decision. It determines whether MonadMon feels **crafted** or **generic**. We follow the user's brief: **finite species pool + individual DNA + growth system** — not procedurally generated creatures.

## 1. Architecture

```
Monster (on-chain) ── tokenId
   ├── speciesId    ── 1..12, index into species catalog
   ├── stage        ── 0..2 (egg, juvenile, adult, ascended)
   ├── dna          ── 64-bit individual trait hash
   ├── level        ── 1..50 (Phase 1 cap)
   ├── xp           ── cumulative
   └── stats        ── hp / atk / def / spd derived from species + DNA + level

Species Catalog (off-chain JSON) ── frontend/public/data/species.json
   └── 12 species, each with:
         ├── name (e.g. "EmberFox")
         ├── element (Fire / Water / Nature / Electric)
         ├── baseStats (per stage)
         ├── art paths (stage0..stage3)
         ├── type effectiveness notes
         └── evolution conditions
```

## 2. Species Catalog (MVP = 12)

3 species per element. Each has 4 stages (egg → juvenile → adult → ascended).

| ID | Species       | Element   | Role         | Rarity     |
|----|---------------|-----------|--------------|------------|
|  1 | EmberFox      | Fire      | Fast attacker | Common    |
|  2 | MagmaTurtle   | Fire      | Tank          | Common    |
|  3 | FlameBird     | Fire      | Crit striker  | Rare      |
|  4 | AquaPup       | Water     | Support       | Common    |
|  5 | BubbleFish    | Water     | Wall          | Common    |
|  6 | OceanDragon   | Water     | Rare bruiser  | Legendary |
|  7 | LeafRabbit    | Nature    | Healer        | Common    |
|  8 | MossGolem     | Nature    | Slow wall     | Common    |
|  9 | ForestDeer    | Nature    | Balanced      | Rare      |
| 10 | VoltCat       | Electric  | Glass cannon  | Common    |
| 11 | SparkMouse    | Electric  | Sniper        | Common    |
| 12 | ThunderWolf   | Electric  | Legendary     | Rare      |

JSON shape (per species):
```json
{
  "id": 1,
  "name": "EmberFox",
  "element": "Fire",
  "role": "Fast attacker",
  "rarity": "Common",
  "stages": [
    { "stage": 0, "name": "Egg",         "hp": 0,   "atk": 0,   "def": 0,   "spd": 0,   "art": "/assets/monsters/emberfox/stage0.png" },
    { "stage": 1, "name": "EmberFox",    "hp": 80,  "atk": 90,  "def": 50,  "spd": 100, "art": "/assets/monsters/emberfox/stage1.png" },
    { "stage": 2, "name": "FlameFox",    "hp": 110, "atk": 130, "def": 70,  "spd": 130, "art": "/assets/monsters/emberfox/stage2.png", "evolvesAtLevel": 20 },
    { "stage": 3, "name": "InfernoFox",  "hp": 150, "atk": 180, "def": 90,  "spd": 160, "art": "/assets/monsters/emberfox/stage3.png", "evolvesAtLevel": 40 }
  ]
}
```

Egg → Stage 1 happens at hatch. Stage 1 → Stage 2 at level 20. Stage 2 → Stage 3 at level 40 (with optional hidden path; see below).

## 3. DNA — individual variation

Two Monsters of the same species are **not identical**. DNA is a 64-bit hash deterministically derived at hatch from `(msg.sender, tokenId, hatchSeed)`.

```
dna = uint64(keccak256(abi.encodePacked(minter, tokenId, hatchSeed)))
```

DNA fields (high bits first):

| Bits     | Trait           | Range | Effect                              |
|----------|-----------------|-------|-------------------------------------|
| [63..56] | trait_a (8)     | 0..3  | Visual accent variant (palette index) |
| [55..48] | trait_b (8)     | 0..3  | Markings variant (palette index)    |
| [47..40] | stat_tilt (8)   | 0..99 | Stat bias percentage toward ATK or SPD |
| [39..32] | affinity (8)    | 0..3  | Slight bonus to one type matchup    |
| [31..0]  | cosmetic_seed   | 0..2^32-1 | Drives which generated variant art is loaded by the FE |

DNA is deterministic, verifiable, and reproducible. The same inputs produce the same DNA.

## 4. Stats at hatch

```
baseStage1 = speciesCatalog[speciesId].stages[1]
hp  = base.hp  * (0.9 + 0.2 * rand01(dna, salt=0)) * (1 + level*0.02)
atk = base.atk * (0.9 + 0.2 * rand01(dna, salt=1)) * (1 + level*0.02)
def = base.def * (0.9 + 0.2 * rand01(dna, salt=2)) * (1 + level*0.02)
spd = base.spd * (0.9 + 0.2 * rand01(dna, salt=3)) * (1 + level*0.02)
```

Stat ranges bounded (90%–110% of base at level 1) so species identity stays readable.

## 5. Hidden evolutions

DNA + level + special items (Phase 2) can unlock alternate Stage 3 forms.

Example: **EmberFox** with `trait_a == 1` and `battlesWon >= 100` → Stage 3 = **Crystal EmberFox** (different art, +10% ATK).

Phase 1 does not require items. Phase 2 may.

## 6. Rarity at hatch

Rarity is encoded in the species id; the hatch RNG picks a species, and rarity follows. Target distribution over all mints:

| Rarity     | Species                                                                  | Share |
|------------|--------------------------------------------------------------------------|-------|
| Common     | EmberFox, MagmaTurtle, AquaPup, BubbleFish, LeafRabbit, MossGolem, VoltCat, SparkMouse | 50% (8 × 6.25%) |
| Rare       | FlameBird, ForestDeer, ThunderWolf                                      | 30% (3 × 10%) |
| Legendary  | OceanDragon                                                              | 20%   |

Implemented in `contracts/src/lib/RarityRoll.sol`. Math: pick `r = seed % 100`; if `r < 50` → Common, else if `r < 80` → Rare, else Legendary; then pick within band by `seed >> 8 % bandSize`.

## 7. Art pipeline — **how the visuals get made**

Locked decision (ADR-0001): **Pollinations.ai + `flux` model + Node batch driver.**

### Source
- **Pollinations.ai** — `GET https://image.pollinations.ai/prompt/{prompt}?model=flux&seed=N&width=W&height=H&nologo=true&enhance=false&private=true`.
- Zero API key. Zero cost. Returns PNG/JPEG binary.
- Re-verify availability at start of Phase 1 (Issue 0013).

### Driver
- [`scripts/generate-monsters.mjs`](../../scripts/generate-monsters.mjs) — Node 20 native `fetch`, no deps.
- Idempotent. Skips existing files unless `--force`.
- Records every output in `frontend/public/assets/monsters/manifest.json`.

### Style anchor (locked)
Every prompt begins with this string so all 12 species share one look:
```
flat illustration, single character centered on clean white background,
thick clean linework, soft cel-shading, vibrant limited 5-color palette,
front-facing 3/4 view, no text, no watermark, no frame, no shadow,
chibi proportion, child-friendly,
```

### Determinism
- Hero seed: `fnv1a32("monadmon:v1:" + speciesId + ":" + stage)`.
- Variant seed: `fnv1a32("monadmon:dna:" + speciesId + ":" + stage + ":" + trait_a + ":" + trait_b)`.
- Re-running the script reproduces bit-for-bit the same hero set (subject to Pollinations policy).

### Outputs
- Heroes: `frontend/public/assets/monsters/<species>/stage{0..3}.png` (48 files).
- Variants: `frontend/public/assets/monsters/<species>/stage{1..3}_dna_{0..3}_{0..3}.png` (432 files).
- Manifest: `frontend/public/assets/monsters/manifest.json` lists every output, its seed, byte size.

### Manual cull
The script produces a candidate set. A human (Coordinator or user) opens the folder, deletes anything that breaks style or looks wrong, then commits the approved set. The script is re-runnable to fill gaps.

### Failure handling
- 5xx or non-image response → 3 retries with exponential backoff.
- Rate-limit sleep 1.5s between requests (free tier is unannounced-limited).
- Full batch (heroes + variants): 480 images, ~12 minutes wall time.
- If Pollinations disappears, swap the `pollinationsUrl()` function — call sites unchanged.

## 8. Where the art lives

```
frontend/public/assets/monsters/
├── emberfox/
│   ├── stage0.png
│   ├── stage1.png
│   ├── stage1_dna_0_0.png ... stage1_dna_3_3.png
│   ├── stage2.png
│   ├── stage2_dna_*.png
│   ├── stage3.png
│   └── stage3_dna_*.png
├── magmaturtle/
│   └── ...
└── manifest.json

frontend/public/data/
└── species.json   # canonical 12-species catalog
```

The contract never stores image data. It stores `speciesId + dna`. Frontend resolves art via:
```
const variant = `${stage}_dna_${trait_a}_${trait_b}.png`
const hero    = `${stage}.png`
const path    = `/assets/monsters/${speciesId}/${variant exists ? variant : hero}`
```

## 9. Why this design works
- **Crafted feel** — players see a designed character (style anchor locks the look), with 16 DNA-driven palette variants per species per stage for individuality.
- **Emotional anchor** — DNA creates personal identity without sacrificing species identity.
- **Free** — zero API cost.
- **Testable** — all stat and DNA math is pure and deterministic.
- **Extensible** — Phase 2 adds items / hidden evolutions without contract redesign.
- **Verifiable** — anyone can re-derive a Monster's DNA from `(minter, tokenId, seed)`.
- **Swappable** — single function in the driver is the only dependency on Pollinations.
