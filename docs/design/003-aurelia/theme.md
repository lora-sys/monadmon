# Theme — Aurelia

## Palette (dark, high-contrast)

| Token | Hex | Use |
| --- | --- | --- |
| `--bg-void` | `#04060B` | page background |
| `--bg-pitch` | `#0A0C13` | card surface |
| `--bg-ink` | `#10131C` | raised surface |
| `--line` | `#1F2333` | hairlines |
| `--ink-0` | `#F5F6FA` | display body |
| `--ink-1` | `#B5BAC8` | secondary text |
| `--ink-2` | `#858DA1` | tertiary / labels |
| `--accent` | `#7AF0BA` | primary accent (mint) |
| `--accent-2` | `#C9A7FF` | secondary accent (lavender) |
| `--fire` | `#E25C3A` | element fire |
| `--water` | `#2E8DD0` | element water |
| `--nature` | `#5CD891` | element nature |
| `--electric` | `#C8A91F` | element electric |
| `--danger` | `#FF6F7D` | errors / unavailable |

## Type

- display: **Space Grotesk 700**, `clamp(5rem,14vw,18rem)`, line-height 0.85, `letter-spacing: -0.04em`
- body: Inter 400, 16px base
- mono: JetBrains Mono 400, used for addresses / DNA / token ids
- labels: Inter 500, `letter-spacing: 0.2em`, uppercase, `--ink-2`

## Spacing

- 4-pt grid
- section vertical: 18-24rem
- block: 2-4rem
- column gap: 24-48px

## Motion

- hero float: 4s ease-in-out infinite (2px vertical drift)
- breath (creature detail): 2.4s ease-in-out infinite (scale 1 → 1.015)
- particle drift: 20s linear infinite
- entry stagger: 60ms with 0.6s ease-out
- hover: 220ms cubic-bezier(0.4, 0, 0.2, 1)
- scroll-driven (GSAP): text split into chars/words, fade+rise on enter,
  pin for hero, scrub for parallax

## Texture

- fixed noise (SVG `<feTurbulence>` filter) at 4% opacity
- accent radial glow blur-3xl on hero, monster detail
- gradient mesh backgrounds on `/` and `/monster/[tokenId]`

## Awwwards self-score target

- Composition: 10
- Type: 10
- Color: 10
- Motion: 10
- Originality: 10
- Performance: 10

Total: 60/60
