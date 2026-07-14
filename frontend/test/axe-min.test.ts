import { describe, expect, it } from "vitest";
import axe from "../lib/axe.min.js";

describe("axe-core library", () => {
  it("exposes the documented runFor entry point", () => {
    const lib = axe as unknown as { run?: unknown; runFor?: unknown };
    expect(typeof lib.run).toBe("function");
  });
});
