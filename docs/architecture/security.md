# Security

Threat model for MVP.

## Assets
- Monster NFTs (player-owned, ERC-721).
- Item NFTs (Phase 2).
- MON balance for gas.

## Adversaries
- **Sybil attacker** — tries to mint many eggs. Mitigation: one-egg-per-wallet cap in MVP.
- **Cheater** — tries to spoof hatch outcomes. Mitigation: commit-reveal + on-chain seed binding (ADR-0004).
- **Front-runner** — tries to snipe reveals. Mitigation: commit phase hides seed; reveal in same or next tx bound to sender.
- **Griefing challenger** — spams battles. Mitigation: challenger must stake; loser pays minor MON fee in Phase 2 (out of MVP scope).

## Key checks
- All randomness paths reviewed by `security-reviewer`.
- All external functions use `nonReentrant` where state mutation + external call co-occur.
- `tx.origin` never used for auth.
- No `delegatecall` in MVP.
- All custom errors; no string reverts leaking state.

## Reporting
- Critical → halt deploy, file `Bug` Issue, fix before any mainnet.
- High → fix before Phase 5 exit.
- Medium/Low → tracked, not blocking.

## Audit
- MVP does not get a formal audit (testnet only).
- Pre-mainnet (out of MVP): external audit required.
