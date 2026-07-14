// Shared design tokens and motion primitives for the creative redesign.
// All numeric scales are intentionally bespoke (not Tailwind defaults)
// so a reviewer can spot the language immediately.
export const designTokens = {
  ink: {
    0: "#F5F6FA",
    1: "#B5BAC8",
    2: "#858DA1",
    3: "#5B6378",
  },
  accent: {
    0: "#7AF0BA",
    1: "#5DD0A0",
    2: "#C9A7FF",
    danger: "#FF6F7D",
    fire: "#E25C3A",
    water: "#2E8DD0",
    nature: "#5CD891",
    electric: "#C8A91F",
  },
  bg: {
    0: "#0A0C13",
    1: "#0E1119",
    2: "#141826",
    line: "#1F2333",
  },
  motion: {
    entry: "cubic-bezier(0.22, 1, 0.36, 1)",
    hover: "cubic-bezier(0.4, 0, 0.2, 1)",
    durations: {
      breath: 2.4,
      hover: 0.22,
      entry: 0.6,
    },
  },
} as const;

export const grainTexture =
  "radial-gradient(circle at 30% 20%, rgba(122,240,186,0.08), transparent 55%)," +
  "radial-gradient(circle at 75% 80%, rgba(201,167,255,0.06), transparent 50%)," +
  "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 3px)";
