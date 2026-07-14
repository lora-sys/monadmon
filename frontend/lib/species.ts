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
      return "#E25C3A";
    case "Water":
      return "#2E8DD0";
    case "Nature":
      return "#5CD891";
    case "Electric":
      return "#C8A91F";
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

export function monsterArt(speciesId: number, stage: number, _dna: bigint | number): string {
  const sp = speciesById[speciesId];
  if (!sp) return "/assets/monsters/placeholder.svg";
  const resolvedStage = sp.stages.some((candidate) => candidate.stage === stage)
    ? stage
    : 1;
  return `/assets/monsters/${speciesId}/stage${resolvedStage}.png`;
}

export function elementOf(speciesId: number): string {
  return speciesById[speciesId]?.element ?? "Fire";
}
