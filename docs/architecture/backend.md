# Backend / Indexer Architecture

Phase 2+ only. MVP does not run a backend.

## Why
- RPC reads for leaderboards / profiles are slow and rate-limited.
- A simple indexer materializes views and keeps the FE snappy.

## Stack
- TypeScript + viem + better-sqlite3.
- Single Node process. No queues in MVP. Polling block subscription.

## Schema (SQLite)
```sql
CREATE TABLE monsters (
  token_id INTEGER PRIMARY KEY,
  species_id INTEGER NOT NULL,
  level INTEGER NOT NULL,
  xp INTEGER NOT NULL,
  dna INTEGER NOT NULL,
  owner TEXT NOT NULL,
  battles_won INTEGER NOT NULL DEFAULT 0,
  battles_lost INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);
CREATE INDEX monsters_owner ON monsters(owner);
CREATE TABLE battles (
  battle_id INTEGER PRIMARY KEY,
  challenger TEXT NOT NULL,
  opponent TEXT NOT NULL,
  winner TEXT,
  seed TEXT NOT NULL,
  block_number INTEGER NOT NULL,
  block_timestamp INTEGER NOT NULL
);
CREATE TABLE leaderboard (
  address TEXT PRIMARY KEY,
  wins INTEGER NOT NULL,
  total_xp INTEGER NOT NULL,
  rank INTEGER NOT NULL
);
```

## Endpoints (Phase 2)
- `GET /api/monsters/:address`
- `GET /api/leaderboard?limit=100`
- `GET /api/battles/:battleId`
- `GET /api/profile/:address`

## Reorg safety
- Wait 5 confirmations before persisting.
- Re-fetch and diff on each new block.

## Deploy
- Single Fly.io / Railway app. SQLite file backed by a persistent volume.
