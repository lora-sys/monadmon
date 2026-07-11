# Design Tokens

CSS variables drive Tailwind. Final values after brand review.

## Color (dark mode default)
```
--bg-0     #0B0D14   /* page background */
--bg-1     #11141D   /* card */
--bg-2     #1A1E2A   /* elevated */
--ink-0    #F5F6FA   /* primary text */
--ink-1    #B5BAC8   /* secondary */
--ink-2    #6E7589   /* tertiary */
--line     #232839   /* divider */

--accent   #7AF0BA   /* mint/aurora — primary brand */
--accent-2 #C9A7FF   /* lavender — secondary brand */
--warn     #F2C14E
--danger   #FF6F7D

--fire     #FF7A59
--water    #5BB7FF
--nature   #5CD891
--electric #E2D24A
```

## Typography
- Display: **Space Grotesk** (variable, 600–700).
- Body: **Inter** (variable, 400–500).
- Mono: **JetBrains Mono** for DNA hex, contract addresses, ids.

## Spacing
- 4-pt grid. Use Tailwind defaults.

## Radius
- 8px on cards, 6px on buttons, 999px on pills.
- NO 16–24px rounded corners (cliché Web3).

## Motion
- Default ease: `cubic-bezier(0.22, 1, 0.36, 1)` (out-expo).
- Default duration: 240ms.
- Hatch animation: 2400ms total, multi-stage.
- Reduced-motion: respects `prefers-reduced-motion`.
