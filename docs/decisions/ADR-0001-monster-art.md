# ADR-0001 — Monster Art Generation Method

- Status: **Proposed — pending user decision**
- Date: 2026-07-11
- Deciders: @user, @coordinator, @design
- Consulted: @frontend, @backend
- Supersedes: none

## Context
MonadMon's value hinges on the moment a player sees their Monster. If the art looks random or generic, the emotional hook ("my first Monad creature, mine forever") collapses. The user's brief calls out exactly this risk.

We need to produce **36 hero images** (12 species × 3 stages) plus per-DNA palette variants, in a finite time and budget, with a consistent style across all 12 species.

## Options

### Option A — Pre-designed hero art (recommended)
- Commission 36 base PNGs. Source: Fiverr/Upwork illustrator, OR AI-generated via Midjourney/SDXL with heavy curation.
- Hand-curate palette variants driven by DNA `trait_a` / `trait_b` (4 × 4 = 16 palette variants per stage = 144 effective variants per species).
- Style guide locked up front (palette, line weight, shading).
- **Pros:** consistent premium feel; first impression is "designed"; team controls every pixel.
- **Cons:** requires designer hours; 1–2 weeks if commissioning; curation pass if AI.

### Option B — Procedural pixel sprites
- Use **`pixel-sprite-generator`** (npm, Sander Frenken) — deterministic pixel sprite generator from a hash. Battle-tested in JS games.
- Or **PixelLab** (Python + API) — diffusion pixel-art generator with pose/palette control.
- **Pros:** cheap; every Monster unique; reproducible.
- **Cons:** style is harder to lock across 12 species; can look generic; not "premium" by default.

### Option C — AI batch + curation
- Stable Diffusion XL or ComfyUI pipeline. Generate 50–100 candidates per species/stage.
- Designer cherry-picks and post-processes top decile.
- **Pros:** variety; scalable.
- **Cons:** GPU required (or paid API); high iteration count; style drift across species.

## Decision
**TBD — awaiting user decision.**

Coordinator recommendation: **Option A** with **Option C variants for cosmetic DNA-driven palettes**.
- Hero art: hand-designed or AI-curated 36 PNGs.
- Cosmetic DNA variants: SDXL/ComfyUI batch → pick 4 best palette variants per species/stage.

This hybrid gives the "crafted feel" the brief demands without ballooning design hours.

## Consequences (once decided)
- Locks the file layout under `frontend/public/assets/monsters/<species>/`.
- Locks the species catalog JSON schema in `docs/design/monster-system.md` §2.
- Drives the timing of ISSUE-0003 (species catalog).
- If Option A is selected, ISSUE-0003 should split into ISSUE-0003a (commission art) and ISSUE-0003b (palette variants).

## References
- `docs/design/monster-system.md` §7 (Art pipeline)
- `docs/design/brand.md`
