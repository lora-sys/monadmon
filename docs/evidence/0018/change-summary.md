# Change Summary — ISSUE-0018: Local Anvil deploy + agent-browser E2E

## What
- Deployed the full MonadMon contract suite to a local Anvil instance (chain id 31337).
- Started the Next.js dev server pointed at the deployed addresses.
- Used `agent-browser` (Chrome via CDP) to capture screenshots of every MVP page.
- Ran a complete on-chain happy path via `cast` to prove the contracts work end-to-end.

## Deployed addresses (Anvil, deterministic)
- `MonsterNFT`:      `0xe7f1725e7734ce288f8367e1bb143e90bb3f0512`
- `GenesisMinter`:   `0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9`
- `Battle`:          `0xdc64a140aa3e981100a9beca4e685f962f0cf6c9`
- `BlockPrevRandao`: `0x5fbdb2315678afecb367f032d93f642f64180aa3`
- `ItemNFT`:         `0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0`

## On-chain happy path (verified via cast)
1. Alice (deployer account) called `mintGenesis()` -> tokenId 1 minted.
2. Alice called `hatch(1)` -> revealed speciesId 3 (FlameBird, Fire, Rare), DNA 0x088998e50c7af0f4.
3. Alice called `train(1)` -> +30 XP, +2 ATK.
4. Bob (anvil account 1) called `mintGenesis()` -> tokenId 2.
5. Bob called `hatch(2)` -> revealed speciesId 7 (LeafRabbit, Nature, Common), DNA 0x6b8c0d31c4cae035.
6. Alice called `Battle.challenge(1, bob, 2)` -> challengeId 1 created.
7. Bob called `Battle.acceptAndResolve(1)` -> battle resolved (Bob won, Alice was unhatched).
8. Alice re-hatched, trained, challenged again; Bob accepted; Alice won.

### Final state
- Alice's Monster (#1, FlameBird): speciesId=3, level=1, xp=80, hp=126, atk=199, def=152, spd=260, battlesWon=1, battlesLost=0.
- Bob's Monster (#2, LeafRabbit): speciesId=7, level=1, xp=60, hp=110, atk=137, def=210, spd=178, battlesWon=1, battlesLost=1.
- Challenges: 2 recorded, both Resolved.

## Screenshots captured (via agent-browser)
- 01-landing.png
- 02-mint.png, 02-train.png, 02-arena.png, 02-leaderboard.png
- 03-monster-detail.png (live on-chain data)
- 04-arena-with-battles.png

## Acceptance Criteria
- [x] All 7 MVP pages render without errors (HTTP 200).
- [x] Contracts deployed to local Anvil.
- [x] Full mint -> hatch -> train -> challenge -> accept -> resolve flow verified on-chain.
- [x] Monster detail page reads live on-chain data (speciesId, stats, DNA, XP, battles).
- [x] Arena page shows recent challenges with PENDING/RESOLVED states.

## Testnet deploy (deferred to ISSUE-0019)
The Monad testnet deploy is gated on a funded wallet. This PR proves the local
end-to-end flow. The deploy script is identical; only --rpc-url and the
signing key change.

## Wallet UI limitation
In a headless environment without a browser wallet extension, the wallet
connect flow cannot be exercised end-to-end through agent-browser. The cast
calls above prove the on-chain path is correct; the FE renders the wallet
picker and reads wallet state via wagmi hooks.
