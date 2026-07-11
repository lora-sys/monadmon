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

Species Catalog (off-chain JSON) ── /data/species.json
   └── 12 species, each with:
         ├── name (e.g. "EmberFox")
         ├── element (Fire / Water / Nature / Electric)
         ├── baseStats (per stage)
         ├── art paths (stage0..stage2)
         ├── type effectiveness notes
         └── evolution conditions
```

## 2. Species Catalog (MVP = 12)

3 species per element. Each has 3 stages (egg → juvenile → adult/ascended).

| ID | Species       | Element   | Role         | Notes |
|----|---------------|-----------|--------------|-------|
|  1 | EmberFox      | Fire      | Fast attacker | SPD-leaning |
|  2 | MagmaTurtle   | Fire      | Tank          | HP/DEF-leaning |
|  3 | FlameBird     | Fire      | Crit striker  | High ATK |
|  4 | AquaPup       | Water     | Support       | High SPD |
|  5 | BubbleFish    | Water     | Wall          | High HP/DEF |
|  6 | OceanDragon   | Water     | Rare bruiser  | Mid stats, big ATK |
|  7 | LeafRabbit    | Nature    | Healer        | Recovery aff. |
|  8 | MossGolem     | Nature    | Slow wall     | High DEF |
|  9 | ForestDeer    | Nature    | Balanced      | |
| 10 | VoltCat       | Electric  | Glass cannon  | Very high SPD/ATK, low HP |
| 11 | SparkMouse    | Electric  | Sniper        | Crit-leaning |
| 12 | ThunderWolf   | Electric  | Legendary     | Best overall |

Each species entry contains:
```json
{
  "id": 1,
  "name": "EmberFox",
  "element": "Fire",
  "role": "Fast attacker",
  "rarity": "Common",
  "stages": [
    { "stage": 0, "name": "Egg",       "hp": 0,  "atk": 0,  "def": 0,  "spd": 0,  "art": "/assets/monsters/emberfox/egg.png" },
    { "stage": 1, "name": "EmberFox",  "hp": 80, "atk": 90, "def": 50, "spd": 100, "art": "/assets/monsters/emberfox/stage1.png" },
    { "stage": 2, "name": "FlameFox",  "hp": 110,"atk": 130,"def": 70, "spd": 130, "art": "/assets/monsters/emberfox/stage2.png", "evolvesAtLevel": 20 },
    { "stage": 3, "name": "InfernoFox","hp": 150,"atk": 180,"def": 90, "spd": 160, "art": "/assets/monsters/emberfox/stage3.png", "evolvesAtLevel": 40, "hidden": false }
  ]
}
```

Egg → Stage 1 happens at hatch. Stage 1 → Stage 2 at level 20. Stage 2 → Stage 3 at level 40 (with optional hidden path; see below).

## 3. DNA — individual variation

Two Monsters of the same species are **not identical**. DNA is a 64-bit hash deterministically derived at hatch from `(msg.sender, tokenId, hatchSeed)`.

```
dna = keccak256(abi.encodePacked(minter, tokenId, hatchSeed)) & type(uint64).max
```

DNA is split into trait fields (high bits first):

| Bits     | Trait           | Range | Effect                              |
|----------|-----------------|-------|-------------------------------------|
| [63..56] | trait_a (8)     | 0..3  | Visual accent variant               |
| [55..48] | trait_b (8)     | 0..3  | Markings variant                    |
| [47..40] | stat_tilt (8)   | 0..99 | Stat bias percentage toward ATK or SPD |
| [39..32] | affinity (8)    | 0..3  | Slight bonus to one type matchup    |
| [31..0]  | cosmetic_seed   | 0..2^32-1 | Drives hatched art variants (e.g. palette) |

DNA is deterministic, verifiable, and reproducible. The same inputs produce the same DNA — useful for future tools, never a leak.

## 4. Stats at hatch

```
baseStage1 = speciesCatalog[speciesId].stages[1]
hp  = base.hp  * (0.9 + 0.2 * rand01(dna, salt=0)) * (1 + level*0.02)
atk = base.atk * (0.9 + 0.2 * rand01(dna, salt=1)) * (1 + level*0.02)
def = base.def * (0.9 + 0.2 * rand01(dna, salt=2)) * (1 + level*0.02)
spd = base.spd * (0.9 + 0.2 * rand01(dna, salt=3)) * (1 + level*0.02)
```

Stat ranges are bounded (90%–110% of base at level 1) so species identity stays readable.

## 5. Hidden evolutions

DNA + level + special items (Phase 2) can unlock alternate Stage 3 forms.

Example: **EmberFox** with `trait_a == 1` and `battlesWon >= 100` → Stage 3 = **Crystal EmberFox** (different art, +10% ATK).

Phase 1 does not require items. Phase 2 may.

## 6. Rarity at hatch

Species rarity is fixed per species id (not rolled per hatch). The 12-species distribution is curated:

| Rarity     | Species                                | Share of total mints |
|------------|----------------------------------------|----------------------|
| Common     | EmberFox, AquaPup, LeafRabbit, VoltCat | 50% (4 × 12.5%)      |
| Common     | MagmaTurtle, BubbleFish, MossGolem, SparkMouse | 30% (4 × 7.5%) |
| Rare       | FlameBird, ForestDeer, ThunderWolf     | 15% (3 × 5%)         |
| Legendary  | OceanDragon                            | 5%                    |

The hatch RNG (commit-reveal) picks a rarity band first, then a species within it. Rarity never rolls — it's encoded in the species id.

> **Decision pending:** this distribution will be encoded in `RarityRoll.sol` (see ADR-0001 for art generation; rarity math is independent).

## 7. Art pipeline — **how the visuals get made**

**The big question the user asked.** Three viable approaches; one will be chosen in ADR-0001.

### Option A — Pre-designed (recommended for MVP)
- Hire / commission 36 PNGs (12 species × 3 stages). Hand-drawn or AI-generated, then curated.
- Source options: commission an artist on Fiverr/Upwork, or use AI image gen (Midjourney, SDXL) and have a designer cherry-pick + post-process.
- Pros: full art control, consistent style, premium feel, fast turnaround.
- Cons: up-front time; needs one designer pass.

### Option B — Procedural pixel-art generation
- Use a mature library to procedurally generate sprite variants from a base sprite.
- Mature options:
  - **`pixel-sprite-generator`** (npm, Sander Frenken) — generates deterministic pixel sprites from a hash. Mature, used in many JS games.
  - **PixelLab** (Python + API) — diffusion-based, generates pixel art characters with control over pose, palette, detail.
- Pros: every Monster is visually unique; cheap; deterministic.
- Cons: hits-or-misses on "premium feel"; harder to build a consistent style across 12 species; risk of "uncanny valley" pixel mush.

### Option C — AI batch generation + curation
- Use Stable Diffusion XL or ComfyUI pipeline to batch-generate variants per species.
- A designer curates the top decile per species/stage.
- Pros: scalable; high variety.
- Cons: requires GPU, multiple iterations per species; risk of inconsistency.

### Recommendation
**Option A for the hero art (egg + Stage 1 for all 12)**, **with Option C used for cosmetic DNA variants** (the trait_a / trait_b fields drive palette accents). This gives:
- A consistent, hand-crafted first impression.
- Individual DNA-driven variety without breaking style.

This is the decision the user must confirm in **ADR-0001**.

## 8. Where the art lives

```
frontend/public/assets/monsters/
├── emberfox/
│   ├── egg.png
│   ├── stage1.png
│   ├── stage2.png
│   └── stage3.png
├── magmaturtle/
│   └── ...
└── ...

frontend/public/data/
└── species.json   # the canonical 12-species catalog
```

The contract never stores image data. It stores speciesId + dna. Frontend resolves art via `species.json[speciesId].stages[stage].art`.

## 9. Why this design works
- **Crafted feel** — players see a designed character, not random noise.
- **Emotional anchor** — DNA creates personal identity without sacrificing species identity.
- **Testable** — all stat and DNA math is pure and deterministic.
- **Extensible** — Phase 2 adds items / hidden evolutions without contract redesign.
- **Verifiable** — anyone can re-derive a Monster's DNA from `(minter, tokenId, seed)`.
