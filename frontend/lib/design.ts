// Awwwards-grade design system. Single source of truth for tokens, motion, and
// shared 3D / scroll primitives. All page-level visual decisions go through
// this module so the next agent can't drift back to "Tailwind default".
export const designTokens = {
  bg: {
    void: "#04060B",
    pitch: "#0A0C13",
    ink: "#10131C",
    line: "#1F2333",
  },
  ink: {
    0: "#F5F6FA",
    1: "#B5BAC8",
    2: "#858DA1",
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
} as const;

// Awwwards-grade type scale. Display values are intentionally extreme
// (clamp 5-18rem) so headlines become the visual subject, not decoration.
export const typeScale = {
  display: "clamp(5rem, 14vw, 18rem)",
  displayMd: "clamp(3rem, 8vw, 8rem)",
  heading: "clamp(1.75rem, 3vw, 2.5rem)",
  body: "0.95rem",
  label: "0.7rem",
  mono: "0.85rem",
} as const;

// Asymmetric grid tokens (12 columns, 24px gap).
export const grid = {
  gap: "24px",
  columns: 12,
  hero: { left: 7, right: 5 },
  profile: { left: 4, right: 8 },
  arena: { left: 4, right: 8 },
  monster: { left: 6, right: 6 },
} as const;

export const noiseFilter =
  "data:image/svg+xml;utf8," +
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>" +
  "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>" +
  "<feColorMatrix values='0 0 0 0 0.96  0 0 0 0 0.96  0 0 0 0 0.96  0 0 0 0.06 0'/></filter>" +
  "<rect width='100%' height='100%' filter='url(%23n)'/></svg>";

export const accentMesh = {
  hero: `radial-gradient(60% 50% at 22% 40%, rgba(122,240,186,0.30), transparent 65%),
        radial-gradient(50% 50% at 80% 60%, rgba(201,167,255,0.18), transparent 65%),
        radial-gradient(40% 40% at 50% 100%, rgba(94,210,160,0.12), transparent 70%)`,
  detail: `radial-gradient(45% 45% at 35% 35%, rgba(122,240,186,0.22), transparent 60%),
         radial-gradient(50% 50% at 80% 70%, rgba(201,167,255,0.14), transparent 60%)`,
  dim: `radial-gradient(60% 50% at 70% 30%, rgba(122,240,186,0.10), transparent 70%)`,
};
