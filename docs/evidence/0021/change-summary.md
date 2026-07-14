# Change Summary — ISSUE-0021 (Live E2E + Creative Redesign)

Recovery branch `fix/33-live-e2e-rebuild` against `b0afa48`. Two-part
work on the same branch: (1) the MVP-claim recovery from PR #34, and
(2) the $frontend-creative redesign applied to all 7 routes on top of
the recovered backend.

## Round 1 — Live E2E recovery (already merged in PR #34, retained in this branch)

- Backend indexer rewritten to mirror the Solidity ABI exactly (3
  indexed fields), map winner/loser via ChallengeCreated participants,
  await post-battle monster refresh, and persist real block
  timestamps. A new `syncIndexer(client, db, chainId, cfg, lastBlock)`
  seam powers the test suite and the runtime loop.
- Frontend live leaderboard via typed React Query, with explicit
  loading/empty/unavailable states and `role="status" aria-live`.
- Profile page now uses the indexer owner endpoint to render the
  wallet's real token IDs.
- Monster detail uses `bigint.toString(16)` for full-precision DNA
  and exposes the XP progress bar to assistive tech.
- CI now runs `npm test` for backend and frontend.

## Round 2 — Creative redesign (this round)

Custom theme: **"Living Creature on a High-Tech Chain"** — derived
from Theme C (Retro Acid) high-saturation + Theme D (Future 3D)
motion depth + the existing brand accent (#7AF0BA).

### Files

- `frontend/lib/design.ts` — shared motion / color / background
  tokens (CSS variables already mirrored in `app/globals.css`).
- `frontend/components/CreativeShell.tsx` — fixed grain + accent
  glow background, slim sticky header with desktop inline nav +
  mobile bottom nav, monospace footer.
- `frontend/app/layout.tsx` — wraps `Providers` + `CreativeShell`.
- `frontend/app/globals.css` — redesigned token palette, three
  CSS keyframe animations (`mm-breath`, `mm-float`, `mm-marquee`)
  with no blocking GSAP/R3F.
- `frontend/app/page.tsx` — five-section asymmetric landing: hero
  with animated floating poster + accent halo, species marquee,
  numbered "awakening steps" 01-05, full-bleed arena banner,
  league preview with a stat card.
- `frontend/app/mint/page.tsx` — same mint logic, hero with
  3D-style perspective transform on the egg poster, accent
  progress stat row.
- `frontend/app/train/page.tsx` — same training logic, redesigned
  cards with progress bars and color-coded cooldown labels.
- `frontend/app/arena/page.tsx` — same battle logic, redesigned
  challenge form and battle history cards with chip states.
- `frontend/app/leaderboard/page.tsx` — same React Query + 15s
  refetch + retry:0, redesigned hero header.
- `frontend/app/profile/[address]/page.tsx` — same owner-endpoint
  logic, redesigned header with full address, big monster count,
  redesigned card grid.
- `frontend/app/monster/[tokenId]/page.tsx` — same functional
  contract (DNA, stats, XP, train, arena), redesigned left
  60% / right 40% split with breath animation on the portrait.

### Visual & accessibility

- All small-caps labels in the design use `text-[#858DA1]` so axe
  reports zero serious/critical contrast violations on all 8
  states (populated, empty, unavailable, monster detail, both
  profiles, desktop + mobile).
- The `frontend/app/train/page.tsx` raw `<img>` has been
  replaced with `next/image` (resolves L3 from the previous review).
- The script `scripts/run-browser-evidence.sh` was updated to
  target the new H1 / "Creature /" markers in the redesigned
  pages.

## Risk and rollback

Reversible. The recovery portion is local-only; reverting the
PR restores the old static page, the broken indexer ABI, and the
no-test backend. The redesign portion changes the visual system
only; every page still hits the same backend endpoints, so the
behaviour the previous E2E proved is unchanged. No schema
migration, no mint authority change, no wallet signature flow
touched.

## Required reviewers

- bug-hunter — PASS (Round-1 findings still remediated)
- architecture-reviewer — PASS (Round-1 still satisfied)
- security-reviewer — PASS (CORS scope unchanged)
- ui-reviewer — PASS (Round-1 H1–H3 still remediated; L3 train
  `<img>` resolved; new design re-tested with axe on all 8 states,
  zero serious/critical)
