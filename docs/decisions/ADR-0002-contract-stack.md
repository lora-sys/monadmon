# ADR-0002 — Smart Contract Dev Environment

- Status: **Accepted**
- Date: 2026-07-11
- Deciders: @user, @coordinator, @backend

## Context
We need a Solidity dev environment that supports the MVP test surface, including 10k-sample fuzz testing on hatch rarity distribution (AC3.1).

## Decision
**Foundry (Forge + Anvil + Cast).** Install via the standard one-liner:
```
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## Why
- **Native fuzz.** `forge test` runs thousands of fuzz cases per assertion. Hardhat's fuzz path requires a plugin and is slower / less ergonomic.
- **Speed.** Forge compiles and tests in seconds.
- **Monad community alignment.** Monad's own dev docs lean Foundry.

## Consequences
- `contracts/foundry.toml`, `contracts/src/`, `contracts/test/`, `contracts/script/`.
- CI runs `forge fmt --check`, `forge build`, `forge test`, `forge coverage`.
- `ENGINEERING.md` §1 reflects Foundry.
- Local Anvil (`anvil --chain-id 31337`) for FE integration. Testnet deploys go directly to Monad testnet RPC.

## Fallback
If install fails on the user's machine, ADR can be amended to Hardhat. Not the current plan.

## References
- `docs/architecture/smart-contract.md`
- `docs/architecture/security.md`
- `docs/architecture/deploy.md`
