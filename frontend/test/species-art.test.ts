import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { monsterArt, species } from "../lib/species";

describe("monster art manifest", () => {
  it("resolves every species stage to a committed image", () => {
    for (const monsterSpecies of species) {
      for (const stage of monsterSpecies.stages) {
        const art = monsterArt(monsterSpecies.id, stage.stage, 0n);
        expect(art).toBe(
          `/assets/monsters/${monsterSpecies.id}/stage${stage.stage}.png`,
        );
        expect(existsSync(join(process.cwd(), "public", art))).toBe(true);
      }
    }
  });

  it("falls back safely for unknown species and stages", () => {
    expect(monsterArt(999, 1, 0n)).toBe("/assets/monsters/placeholder.svg");
    expect(monsterArt(1, 99, 0n)).toBe("/assets/monsters/1/stage1.png");
  });
});
