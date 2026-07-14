# MonadMon

> **The first living creatures on Monad.**
> Catch them. Train them. Battle them. Yours forever.

MonadMon is an on-chain creature-raising and PvP battle game deployed on
**Monad** (EVM-compatible L1). Each player connects a wallet, mints a
**Genesis Egg**, hatches it into a **Monster** bound to an ERC-721 with
a deterministic 64-bit DNA, and enters a deterministic 1-vs-1 arena where
wins climb a leaderboard powered by an off-chain indexer.

This repository contains the full MVP:

- **Smart contracts** — Foundry (Solidity 0.8.24, OpenZeppelin v5).
- **Off-chain indexer** — TypeScript + viem + better-sqlite3 + Hono.
- **Frontend** — Next.js 14 + wagmi v2 + RainbowKit v2 + framer-motion v12.
- **End-to-end driver** — fresh Anvil two-wallet flow + axe-core WCAG 2.0/2.1
  A/AA visual evidence.

| Layer | Stack |
| --- | --- |
| Contracts | Solidity 0.8.24, OpenZeppelin v5, Foundry (forge / cast / anvil) |
| Indexer | TypeScript, viem, better-sqlite3, Hono |
| Frontend | Next.js 14, React 18, TypeScript strict, Tailwind v3, framer-motion v12 |
| Web3 | wagmi v2, viem v2, RainbowKit v2 |
| Test / E2E | forge test, vitest, agent-browser, axe-core |
| CI | GitHub Actions (contracts / backend / frontend) |

## Gameplay

A complete session is **five steps and five minutes**:

1. **Connect** your wallet. RainbowKit handles MetaMask, Rabby, or any
   WalletConnect peer.
2. **Mint** a Genesis Egg. One egg per wallet, forever.
3. **Hatch** the egg on-chain. A species (1–12) and a 64-bit DNA are
   derived from `block.prevrandao` + the egg's tokenId, so each hatch is
   deterministic and irreproducible.
4. **Train** the creature. Every train costs a 6-hour cooldown and grants
   +30 XP and +2 ATK. Level up when XP ≥ level × 100.
5. **Duel** another trainer. Alice challenges Bob; Bob accepts; the battle
   resolves deterministically on-chain. Wins climb the league.

### Species (12) × Stages (4)

The hatch reveals a species and a 1-3 stage. Each species has a unique
element (Fire / Water / Nature / Electric), role (attacker / tank /
support / crit striker), and rarity (Common / Rare / Legendary).
The 12 species × 4 stages × 4 DNA variants × 2 origin = 384 visual
configurations, all generated deterministically from on-chain entropy.

### Type effectiveness

Fire > Nature > Water > Electric > Fire. The same chart that drives the
battle damage calculation also drives the `RarityRoll.roll` seed
distribution. See `docs/design/battle-formula.md` for the full math.

### Battle outcome

`Battle.acceptAndResolve` reads both monsters, derives a per-block
seed, simulates up to 50 attack turns with type effectiveness and a
12% critical-hit rate, and emits `ChallengeResolved` with the
winnerTokenId, loserTokenId, draw flag, and turn count. The off-chain
indexer materializes every battle into the leaderboard within one
block confirmation.

## Routes

| Path | Description |
| --- | --- |
| `/` | Five-section landing with hero, species marquee, awakening steps 01–05, full-bleed arena, league preview |
| `/mint` | One-egg-per-wallet mint + cinematic 3D-style egg hatch |
| `/train` | 6-hour cooldown training with XP progress bars |
| `/arena` | Create challenge form + recent battles history |
| `/leaderboard` | Live ranked league with loading / empty / unavailable states |
| `/profile/[address]` | Public showroom driven by the indexer owner endpoint |
| `/monster/[tokenId]` | Bigint-precision DNA, stats, breath animation |

## Local development

### Prerequisites

- Node 20+ (`.nvmrc` recommended)
- Foundry (`curl -L https://foundry.paradigm.xyz | bash`)
- Anvil is part of Foundry
- Python 3 (used by the local E2E harness only)

### Install

```bash
git clone https://github.com/lora-sys/monadmon.git
cd monadmon
cd contracts && forge install foundry-rs/forge-std --no-git && forge install OpenZeppelin/openzeppelin-contracts@v5.1.0 --no-git && cd ..
cd frontend && npm install --no-audit --no-fund
cd ../backend && npm install --no-audit --no-fund
```

### Run the deterministic two-wallet flow

`scripts/local-e2e.sh` boots a fresh Anvil, deploys the contracts, runs
two Anvil accounts (Alice = deployer, Bob = account #1) through
mint → hatch → train → challenge → accept-and-resolve, asserts the
leaderboard reflects the battle, restarts the indexer to prove
restart idempotency, and leaves the stack running for browser
inspection:

```bash
# 1. pick free ports; we use 8545 / 8101 / 8100 below
ANVIL_PORT=8545 RPC_URL=http://127.0.0.1:8545 \
BACKEND_PORT=8101 FRONTEND_PORT=8100 \
KEEP_RUNNING=1 ./scripts/local-e2e.sh
```

The script picks different ports automatically if the above are taken.
`KEEP_RUNNING=1` is required to keep the stack alive in the foreground
for the next step; omit it to run as a one-shot.

### Open the site

Once the script prints the stack URLs, point a browser at
`http://127.0.0.1:8100/`. RainbowKit will offer MetaMask / Rabby in
the header; pick one and connect to the local Anvil RPC.

### Capture accessibility evidence

```bash
BASE_URL=http://127.0.0.1:8100 ./scripts/run-browser-evidence.sh
```

This renders populated, empty, and unavailable leaderboard plus monster
detail and both profiles at 1440×900 and 390×844, injecting
`axe-core` (WCAG 2.0/2.1 A/AA) on every route. Outputs land in
`docs/evidence/0021/screenshots/` and `docs/evidence/0021/test-results/axe-*.json`.

## Tests

| Suite | Command | Count |
| --- | --- | --- |
| Contracts | `cd contracts && forge test -q` | 47 |
| Backend | `cd backend && npm test` | 9 |
| Frontend | `cd frontend && npm test` | 14 |
| Backend typecheck (incl. tests) | `cd backend && npm run typecheck` | green |
| Frontend typecheck | `cd frontend && npm run typecheck` | green |
| Frontend lint | `cd frontend && npm run lint` | clean |
| Frontend production build | `cd frontend && npm run build` | 9 routes |
| Backend production build | `cd backend && npm run build` | green |
| Contracts fmt | `cd contracts && forge fmt --check` | clean |

All three CI jobs run on every push and PR via
`.github/workflows/ci.yml`.

## Project structure

```
monadmon/
├── AGENTS.md                # L0 operating contract for AI agents
├── CLAUDE.md                # mirror of AGENTS.md for Claude-family tools
├── CONTRIBUTING.md          # issue-first workflow, PR template
├── DEMO.md                  # 5-minute demo script
├── ENGINEERING.md           # style, deps, review rules
├── LICENSE                  # MIT
├── PROJECT_STATUS.md        # live kanban
├── README.md                # this file
├── README.zh.md             # 中文版 README
├── TESTING.md               # test strategy
├── backend/                 # Phase 2 indexer (TS + Hono + SQLite)
│   ├── package.json
│   ├── run-indexer.sh       # thin env wrapper
│   ├── src/{abis,chains,db,indexer,server,index}.ts
│   └── test/                # vitest fixtures
├── contracts/               # Foundry workspace
│   ├── foundry.toml
│   ├── src/{MonsterNFT,GenesisMinter,Battle,ItemNFT,interfaces,lib}/
│   ├── test/                # forge tests (47 total)
│   └── script/Deploy.s.sol
├── docs/                     # product / arch / design / decisions / evidence
│   ├── INDEX.md
│   ├── architecture/        # system, FE, BE, contracts, monad, storage, security, deploy
│   ├── design/              # brand, tokens, components, ui-patterns, monster-system, battle-formula
│   ├── product/             # prd, mvp, roadmap, user-stories, feature-specs
│   ├── decisions/           # ADR-0001..0004
│   └── evidence/0021/       # live E2E + creative redesign pack
├── frontend/                # Next.js 14 app router
│   ├── app/                 # /, /mint, /train, /arena, /leaderboard, /profile/[address], /monster/[tokenId]
│   ├── components/          # CreativeShell, Header, Providers, LeaderboardView
│   ├── lib/                 # wagmi, abis, contracts, species, design, indexer, axe.min
│   ├── public/assets/       # species art + marketing posters
│   └── test/                # vitest
├── memory/                  # project + lessons
├── scripts/                 # local-e2e.sh, run-browser-evidence.sh
├── sessions/                # per-session logs
└── skills/                  # project-local skill additions
```

## Architecture summary

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Next.js 14  │───▶│ Monad RPC    │───▶│  Contracts   │
│  + wagmi/viem │    │ (viem JSON-  │    │  - MonsterNFT│
│  + RainbowKit│    │  RPC)        │    │  - Genesis   │
└──────┬───────┘    └──────────────┘    │  - Battle    │
       │                                │  - IRandomSrc│
       │                                └──────┬───────┘
       │ events via logs                      │ events
       │                                      ▼
       │                              ┌──────────────┐
       │                              │   Indexer    │
       │                              │ TS + Hono +  │
       ▼                              │   SQLite     │
  read /api/leaderboard              └──────┬───────┘
  read /api/monsters/owner/:addr           ▲
  read /api/monsters/:id                  │
                                           │
                                  poll every 250 ms
                                  and await 0 confirmations
                                  for instant leaderboard updates
```

See `docs/architecture/` for full data flow, event schema, and
security model.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `RPC_URL` | `http://127.0.0.1:8545` | Backend → Anvil/Monad RPC |
| `PORT` (backend) | `3001` | Hono HTTP port |
| `MONSTER_NFT_ADDRESS` | (set per run) | Indexer reads the `EggMinted` / `MonsterHatched` / `Trained` events |
| `BATTLE_ADDRESS` | (set per run) | Indexer reads the `ChallengeCreated` / `ChallengeResolved` events |
| `CONFIRMATIONS` | `5` | Wait N confirmations before persisting (reorg safety) |
| `POLL_INTERVAL_MS` | `2000` | RPC poll cadence |
| `DB_PATH` | `data/monadmon.db` | Indexer SQLite file |
| `NEXT_PUBLIC_INDEXER_URL` | `http://127.0.0.1:3001` | Frontend → indexer base URL |
| `NEXT_PUBLIC_MONAD_RPC_URL` | (testnet) | Frontend → wallet RPC |
| `NEXT_PUBLIC_MONSTER_NFT_ADDRESS` | (set per run) | Frontend reads `getMonster` / `ownerOf` |
| `NEXT_PUBLIC_BATTLE_ADDRESS` | (set per run) | Frontend reads `getChallenge` / `challengeCount` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | _empty_ | When set, enables full RainbowKit (incl. WalletConnect). Empty → injected-wallet only. |
| `NEXT_PUBLIC_GENESIS_MINTER_ADDRESS` | (set per run) | Optional convenience for the Mint page |

`scripts/local-e2e.sh` writes all of the above automatically. The
backend `.env.example` and frontend `.env.example` are checked-in
templates.

## Roadmap (post-MVP)

- #24 — Deploy to Monad testnet (gated on a user-funded wallet).
- Marketplace + trading.
- Item NFT integration (ERC-1155 scaffold already shipped).
- Exploration encounters.
- Guilds and tournaments.
- Spectator / replay mode with the 3D pipeline.

## Contributing

`AGENTS.md` is the source of truth for AI agents working on this
repository. `CONTRIBUTING.md` is the same workflow written for human
contributors. Both reference the **Issue-first** model:

1. Pick or open an Issue.
2. Branch in a worktree (`git worktree add -b fix/<id>-<slug>`).
3. Implement with tests + evidence.
4. Open a PR; pass the 5 cold-start reviewers (bug-hunter,
   behavior-reviewer, architecture-reviewer, security-reviewer,
   ui-reviewer) and the three CI gates.
5. Squash-merge when human review approves.

## License

[MIT](./LICENSE)

## Credits

- **Brand & design language**: living creature on a high-tech chain
  (see `docs/design/brand.md`).
- **Species art**: 12 species × 4 stages generated by `scripts/generate-monsters.mjs`
  via Pollinations.ai (`flux`), no API key required, deterministic seeds.
- **Marketing posters**: three 1402×1122 PNGs in
  `frontend/public/assets/marketing/` (`poster-hero.png`, `poster-arena.png`, `poster-team.png`).
- **Type system**: Space Grotesk (display) + Inter (body) + JetBrains Mono
  (addresses / DNA). Loaded via `next/font` for production.
