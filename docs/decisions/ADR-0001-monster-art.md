# ADR-0001 — Monster Art Generation Method (Pollinations)

- Status: **Accepted**
- Date: 2026-07-11
- Deciders: @user, @coordinator, @design
- Consulted: @frontend, @backend

## Context
MonadMon's emotional hook is the moment a player first sees their Monster. Random procedural noise would collapse that hook. The brief requires a finite species pool plus per-Monster DNA variation, with art quality high enough for a Web3 launch demo.

We need 12 species × 3 stages = **36 hero images**, plus per-DNA cosmetic variants. Cost target: **zero paid API budget** (user direction). Free + scriptable is the constraint.

## Decision
**Use [Pollinations.ai](https://pollinations.ai) as the image source.** Free, no API key, URL-driven (`GET https://image.pollinations.ai/prompt/{prompt}?model=flux&seed=N&width=W&height=H&nologo=true`), returns the image binary. Default model: **`flux`** (best free-tier quality as of 2026-Q1). Re-verify availability at start of Phase 1.

### Why Pollinations
- **Free.** No signup, no quota card, no API key. URL → image.
- **Scriptable.** Native `fetch` from Node 20 works. Easy batch driver.
- **Deterministic.** A `(prompt, seed)` pair reproduces the same image. This lets us lock a hero seed per `(speciesId, stage)` and only re-roll when we want a variant.
- **Style controllable via prompt.** Locking a `style_anchor` string into every prompt gives us cross-species consistency.

### Pipeline
1. **`scripts/generate-monsters.mjs`** — Node 20 script (no deps). Reads `docs/data/species.json`, writes PNGs to `frontend/public/assets/monsters/<species>/<stage>.png` and `frontend/public/assets/monsters/<species>/<stage>_dna_<a>_<b>.png`.
2. **Style anchor** — locked prompt prefix that all 36 hero images share:
   > `flat illustration, single character centered on clean white background, thick clean linework, soft cel-shading, vibrant limited 5-color palette, front-facing 3/4 view, no text, no watermark, no frame, no shadow, chibi proportion, child-friendly,`
3. **Per-image prompt** = `style_anchor + species_descriptors[speciesId][stage] + element_motif[element]`.
4. **Hero seed** = `seed = uint32(keccak256("monadmon:v1:" + speciesId + ":" + stage) >> 0)` — deterministic, recorded in the manifest. Re-running the script reproduces bit-for-bit the same hero.
5. **DNA variants** — for each `(speciesId, stage)` we additionally generate **4 variants** keyed by `(trait_a, trait_b)` ∈ `[0..3]²`. Seed = `uint32(keccak256("monadmon:dna:" + speciesId + ":" + stage + ":" + trait_a + ":" + trait_b))`. Prompt differs only by palette accent words driven by `trait_a` / `trait_b`. The frontend picks the variant matching the Monster's DNA bits.
6. **Manual cull pass** — Coordinator (or user) opens the output folder, deletes any hero that looks off-style. The script is re-runnable to fill gaps. Hero set is "approved" only after the cull.

### Locked parameters
- `model = flux`
- `width = 768`, `height = 768`
- `nologo = true`
- `enhance = false` (predictable; enhancement drifts style)
- `private = true` (avoid public gallery leakage of work-in-progress)

### Failure modes
- **Pollinations 5xx / timeout** — script retries 3× with exponential backoff; logs the failing `(speciesId, stage)`; does not abort the batch.
- **Rate-limit hit** — sleep 1.5 s between requests (free tier is unannounced-limited). Total batch size: 36 heroes + 144 DNA variants = 180 images, ~5 minutes wall-time at 1.5s/req.
- **Pollinations disappears / pivots to paid** — fallback is Option B from the original ADR (PixelLab) or Option C (Replicate paid). The script's API surface is one function (`pollinations.fetch(prompt, opts)`) so swap is local.

### Re-verification before Phase 1
- Coordinator at start of Phase 1 hits `https://image.pollinations.ai/prompt/test?model=flux&width=64&height=64&seed=1` once and records the response in `sessions/<id>/pollinations-check.md`. If it returns a valid image binary, proceed. If not, escalate.

## Consequences
- **Issue ISSUE-0003** (species catalog) splits into:
  - **ISSUE-0003a** — author `docs/data/species.json` with 12 species entries.
  - **ISSUE-0003b** — ship `scripts/generate-monsters.mjs`, run it, manual cull, commit approved hero set.
- **ENGINEERING.md** adds a `scripts/` note: "deterministic; safe to re-run; produces a manifest."
- **No image storage on-chain.** IPFS hosts only the final approved PNGs (see `docs/architecture/storage.md`).
- **License / IP** — Pollinations' default usage terms allow redistribution of generated images for non-commercial / commercial projects. We will record the exact Pollinations terms version in the session log at run time.

## References
- `docs/design/monster-system.md` §7
- `docs/design/brand.md`
- Pollinations docs: https://pollinations.ai (verify URL at Phase 1 start)
- `scripts/generate-monsters.mjs`
