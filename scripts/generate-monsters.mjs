#!/usr/bin/env node
// MonadMon — Pollinations batch driver.
// Generates 12 species × 3 stages hero images + per-DNA variants.
//
// Usage:
//   node scripts/generate-monsters.mjs                   # full batch
//   node scripts/generate-monsters.mjs --only=emberfox   # single species
//   node scripts/generate-monsters.mjs --variants=false  # heroes only
//
// Reads:  frontend/public/data/species.json (committed by ISSUE-0003a)
// Writes: frontend/public/assets/monsters/<species>/<stage>[_dna_a_b].png
//         frontend/public/assets/monsters/manifest.json
//
// Deterministic: same input + same Pollinations policy → same images.
// Re-runnable: existing files are skipped unless --force is passed.

import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SPECIES_JSON = resolve(ROOT, 'frontend/public/data/species.json');
const OUT_ROOT = resolve(ROOT, 'frontend/public/assets/monsters');
const MANIFEST_PATH = join(OUT_ROOT, 'manifest.json');

const POLLINATIONS_BASE = 'https://image.pollinations.ai/prompt/';
const MODEL = 'flux';
const W = 768;
const H = 768;
const RATE_LIMIT_MS = 1500;
const MAX_RETRIES = 3;

// Locked style anchor — every prompt begins with this so all 12 species share
// a single look. Tweak deliberately; never ad-hoc.
const STYLE_ANCHOR =
  'flat illustration, single character centered on clean white background, ' +
  'thick clean linework, soft cel-shading, vibrant limited 5-color palette, ' +
  'front-facing 3/4 view, no text, no watermark, no frame, no shadow, ' +
  'chibi proportion, child-friendly, ';

const ELEMENT_MOTIF = {
  Fire: 'warm orange-red flames, ember sparks,',
  Water: 'aquatic blue gradients, bubble accents,',
  Nature: 'leafy greens, vines, moss details,',
  Electric: 'yellow lightning arcs, crackling energy,',
};

const STAGE_DESCRIPTOR = {
  0: 'mysterious glowing egg with subtle elemental aura,',
  1: 'cute juvenile creature, large eyes, rounded body,',
  2: 'evolved adult form, more defined features, slightly larger,',
  3: 'ascended legendary form, majestic pose, glowing aura,',
};

const VARIANT_PALETTE = {
  0: 'cool muted palette, teal accents,',
  1: 'warm vibrant palette, magenta accents,',
  2: 'earthy natural palette, ochre accents,',
  3: 'monochrome neon palette, electric cyan accents,',
};

function parseArgs(argv) {
  const out = { only: null, variants: true, force: false };
  for (const a of argv.slice(2)) {
    if (a.startsWith('--only=')) out.only = a.slice(7).toLowerCase();
    else if (a === '--variants=false') out.variants = false;
    else if (a === '--force') out.force = true;
  }
  return out;
}

// FNV-1a 32-bit on a utf8 string — stable, no deps.
function fnv1a32(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

function heroSeed(speciesId, stage) {
  return fnv1a32(`monadmon:v1:${speciesId}:${stage}`);
}

function variantSeed(speciesId, stage, traitA, traitB) {
  return fnv1a32(`monadmon:dna:${speciesId}:${stage}:${traitA}:${traitB}`);
}

function buildPrompt(species, stage, variant = null) {
  const motif = ELEMENT_MOTIF[species.element] ?? '';
  const desc = STAGE_DESCRIPTOR[stage] ?? STAGE_DESCRIPTOR[1];
  const palette =
    variant !== null
      ? VARIANT_PALETTE[variant] ?? ''
      : '';
  const speciesDesc =
    stage === 0
      ? 'elemental egg, simple egg shape with elemental markings,'
      : `${species.element.toLowerCase()} elemental creature named ${species.name}, ${species.role ?? ''},`;
  return (
    STYLE_ANCHOR +
    desc +
    ' ' +
    motif +
    ' ' +
    palette +
    ' ' +
    speciesDesc
  );
}

function pollinationsUrl(prompt, seed) {
  const encoded = encodeURIComponent(prompt).slice(0, 1900); // URL length guard
  const params = new URLSearchParams({
    model: MODEL,
    width: String(W),
    height: String(H),
    seed: String(seed),
    nologo: 'true',
    enhance: 'false',
    private: 'true',
  });
  return `${POLLINATIONS_BASE}${encoded}?${params.toString()}`;
}

async function fileExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function fetchWithRetry(url) {
  let lastErr;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      // Sanity: Pollinations returns JSON-shaped errors as 200 sometimes.
      // PNG/JPEG magic-byte sniff.
      const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
      const isJpg = buf[0] === 0xff && buf[1] === 0xd8;
      if (!isPng && !isJpg) throw new Error('response is not a PNG/JPEG');
      return buf;
    } catch (err) {
      lastErr = err;
      await sleep(800 * 2 ** i);
    }
  }
  throw lastErr;
}

async function generateOne({ species, stage, variant, outPath, seed }) {
  if (!(await fileExists(outPath))) {
    const prompt = buildPrompt(species, stage, variant);
    const url = pollinationsUrl(prompt, seed);
    process.stdout.write(`  → ${species.id}/${stage}${variant !== null ? ` dna=${variant}` : ''} (seed=${seed}) ... `);
    const buf = await fetchWithRetry(url);
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, buf);
    console.log(`ok (${(buf.length / 1024).toFixed(1)} KB)`);
    await sleep(RATE_LIMIT_MS);
    return { wrote: true, bytes: buf.length };
  }
  console.log(`  ✓ ${species.id}/${stage}${variant !== null ? ` dna=${variant}` : ''} (cached)`);
  return { wrote: false };
}

async function loadSpecies() {
  const raw = await readFile(SPECIES_JSON, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data.species)) throw new Error('species.json must have { species: [...] }');
  return data.species;
}

async function main() {
  const args = parseArgs(process.argv);
  const species = (await loadSpecies()).filter((s) =>
    args.only ? s.id === args.only || s.name.toLowerCase() === args.only : true,
  );
  if (species.length === 0) {
    console.error(`No species matched ${args.only ? `"${args.only}"` : ''}.`);
    process.exit(1);
  }
  console.log(`MonadMon art batch — ${species.length} species, variants=${args.variants}`);

  const manifest = { generatedAt: new Date().toISOString(), model: MODEL, width: W, height: H, items: [] };

  for (const sp of species) {
    console.log(`\n[${sp.id}] ${sp.name} (${sp.element})`);
    for (const stage of sp.stages.map((s) => s.stage)) {
      const seed = heroSeed(sp.id, stage);
      const out = join(OUT_ROOT, sp.id, `stage${stage}.png`);
      const r = await generateOne({ species: sp, stage, variant: null, outPath: out, seed });
      manifest.items.push({ speciesId: sp.id, stage, seed, path: out, bytes: r.bytes ?? null });

      if (args.variants && stage > 0) {
        // 4×4 variant grid; each palette index is a trait_a/trait_b combo.
        for (let a = 0; a < 4; a++) {
          for (let b = 0; b < 4; b++) {
            const vSeed = variantSeed(sp.id, stage, a, b);
            const vOut = join(OUT_ROOT, sp.id, `stage${stage}_dna_${a}_${b}.png`);
            const vr = await generateOne({
              species: sp,
              stage,
              variant: b, // palette index from trait_b; trait_a shifts prompt word order in future
              outPath: vOut,
              seed: vSeed,
            });
            manifest.items.push({
              speciesId: sp.id,
              stage,
              dna: { trait_a: a, trait_b: b },
              seed: vSeed,
              path: vOut,
              bytes: vr.bytes ?? null,
            });
          }
        }
      }
    }
  }

  await mkdir(OUT_ROOT, { recursive: true });
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest → ${MANIFEST_PATH}`);
  console.log(`Total items: ${manifest.items.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
