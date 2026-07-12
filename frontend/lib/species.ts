import speciesJson from "@/public/data/species.json";

export type SpeciesStage = {
  stage: number;
  name: string;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  art: string;
  evolvesAtLevel?: number;
};

export type Species = {
  id: number;
  slug: string;
  name: string;
  element: "Fire" | "Water" | "Nature" | "Electric";
  role: string;
  rarity: "Common" | "Rare" | "Legendary";
  stages: SpeciesStage[];
};

const data = speciesJson as { species: Species[] };
export const species: Species[] = data.species;

export const speciesById: Record<number, Species> = Object.fromEntries(
  species.map((s) => [s.id, s]),
);

export const speciesBySlug: Record<string, Species> = Object.fromEntries(
  species.map((s) => [s.slug, s]),
);

export function elementColor(element: string): string {
  switch (element) {
    case "Fire":
      return "#FF7A59";
    case "Water":
      return "#5BB7FF";
    case "Nature":
      return "#5CD891";
    case "Electric":
      return "#E2D24A";
    default:
      return "#888";
  }
}

export function rarityColor(rarity: string): string {
  switch (rarity) {
    case "Common":
      return "#7AF0BA";
    case "Rare":
      return "#C9A7FF";
    case "Legendary":
      return "#FFD56B";
    default:
      return "#888";
  }
}

/**
 * Pick the art path for a Monster's DNA. Falls back to the stage hero if the
 * DNA variant isn't available. Accepts bigint or number for dna.
 */
export function monsterArt(speciesId: number, stage: number, dna: bigint | number): string {
  const sp = speciesById[speciesId];
  if (!sp) return "/assets/monsters/placeholder.svg";
  const stageData = sp.stages.find((s) => s.stage === stage) ?? sp.stages[1];
  const dnaNum = typeof dna === "bigint" ? Number(dna) : dna;
  if (stage === 0 || dnaNum === 0) return stageData.art;
  // DNA top 16 bits select the 4x4 variant grid.
  const trait_a = Number((BigInt(dnaNum) >> 56n) & 0xffn) % 4;
  const trait_b = Number((BigInt(dnaNum) >> 48n) & 0xffn) % 4;
  const variantPath = stageData.art.replace(
    /stage(\d+)\.png$/,
    `stage$1_dna_${trait_a}_${trait_b}.png`,
  );
  return variantPath;
}

export function elementOf(speciesId: number): string {
  return speciesById[speciesId]?.element ?? "Fire";
}
