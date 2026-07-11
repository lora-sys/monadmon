# ADR-0002 — Smart Contract Dev Environment

- Status: **Proposed — pending user decision**
- Date: 2026-07-11
- Deciders: @user, @coordinator, @backend

## Context
We need to pick between Foundry (Forge/Anvil/Cast) and Hardhat as the smart contract dev environment. The dev machine does **not** have Foundry pre-installed (`forge`, `foundry`, `anvil` are all absent). It does have Node 20+, pnpm, bun.

## Options

### Option A — Foundry (recommended)
- **Pros:** fast Solidity-native test runner; great fuzz testing (we need it for rarity distribution); gas snapshots; Solidity-native scripting.
- **Cons:** not installed; requires curl | sh install (~2 min, but adds setup step); team must learn Forge conventions.
- Install: `curl -L https://foundry.paradigm.xyz | bash && foundryup`.

### Option B — Hardhat
- **Pros:** zero-install (npm install); huge plugin ecosystem; familiar to most Web3 devs.
- **Cons:** slower Solidity compile; fuzz is via plugin (`hardhat-fuzzer` is limited); less idiomatic for Solidity testing.
- Install: `pnpm add -D hardhat @nomicfoundation/hardhat-toolbox`.

### Option C — Both
- Foundry for tests, Hardhat for plugin-heavy tasks (e.g. mainnet forking, verify).
- **Cons:** cognitive overhead; we don't need this in MVP.

## Decision
**TBD — awaiting user decision.**

Coordinator recommendation: **Option A (Foundry).** The reason is concrete: we need **10k fuzz runs on rarity distribution** in `MonsterNFT.hatch` (per AC3.1), and Forge's native fuzz is far stronger than Hardhat's. Also matches Monad community norms (Monad's own dev docs lean Foundry).

If install is a blocker, Option B is a fine fallback — the harness scaffolds either way.

## Consequences
- `contracts/foundry.toml` (Option A) or `contracts/hardhat.config.ts` (Option B).
- `forge test` (Option A) or `pnpm hardhat test` (Option B) in CI.
- `contracts/script/Deploy.s.sol` (Option A) or `contracts/scripts/deploy.ts` (Option B).
- `ENGINEERING.md` §1 references updated.

## References
- `docs/architecture/smart-contract.md`
- `docs/architecture/security.md`
- `docs/architecture/deploy.md`
