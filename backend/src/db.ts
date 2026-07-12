import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export type DB = Database.Database;

export function openDB(path: string): DB {
  mkdirSync(dirname(path), { recursive: true });
  const db = new Database(path);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  initSchema(db);
  return db;
}

function initSchema(db: DB): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS monsters (
      token_id          INTEGER PRIMARY KEY,
      species_id        INTEGER NOT NULL,
      level             INTEGER NOT NULL,
      xp                INTEGER NOT NULL,
      dna               TEXT    NOT NULL,
      hp                INTEGER NOT NULL,
      atk               INTEGER NOT NULL,
      def               INTEGER NOT NULL,
      spd               INTEGER NOT NULL,
      battles_won       INTEGER NOT NULL DEFAULT 0,
      battles_lost      INTEGER NOT NULL DEFAULT 0,
      owner             TEXT,
      updated_at        INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS battles (
      challenge_id      INTEGER PRIMARY KEY,
      challenger        TEXT    NOT NULL,
      challenger_token  INTEGER NOT NULL,
      opponent          TEXT    NOT NULL,
      opponent_token    INTEGER NOT NULL,
      winner            TEXT,
      loser             TEXT,
      turns             INTEGER NOT NULL,
      draw              INTEGER NOT NULL,
      block_number      INTEGER NOT NULL,
      block_timestamp   INTEGER NOT NULL,
      tx_hash           TEXT    NOT NULL,
      ingested_at       INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_battles_block ON battles(block_number);
    CREATE INDEX IF NOT EXISTS idx_battles_winner ON battles(winner);
    CREATE INDEX IF NOT EXISTS idx_monsters_owner ON monsters(owner);

    CREATE TABLE IF NOT EXISTS indexed_block (
      chain_id          INTEGER PRIMARY KEY,
      last_block        INTEGER NOT NULL
    );
  `);
}

export function upsertMonster(
  db: DB,
  m: {
    tokenId: bigint;
    speciesId: number;
    level: number;
    xp: number;
    dna: string;
    hp: number;
    atk: number;
    def: number;
    spd: number;
    battlesWon: number;
    battlesLost: number;
    owner?: string;
  },
): void {
  db.prepare(
    `INSERT INTO monsters
       (token_id, species_id, level, xp, dna, hp, atk, def, spd, battles_won, battles_lost, owner, updated_at)
     VALUES (@tokenId, @speciesId, @level, @xp, @dna, @hp, @atk, @def, @spd, @battlesWon, @battlesLost, @owner, @now)
     ON CONFLICT(token_id) DO UPDATE SET
       species_id   = excluded.species_id,
       level        = excluded.level,
       xp           = excluded.xp,
       dna          = excluded.dna,
       hp           = excluded.hp,
       atk          = excluded.atk,
       def          = excluded.def,
       spd          = excluded.spd,
       battles_won  = excluded.battles_won,
       battles_lost = excluded.battles_lost,
       owner        = COALESCE(excluded.owner, monsters.owner),
       updated_at   = excluded.updated_at`,
  ).run({
    tokenId: Number(m.tokenId),
    speciesId: m.speciesId,
    level: m.level,
    xp: m.xp,
    dna: m.dna,
    hp: m.hp,
    atk: m.atk,
    def: m.def,
    spd: m.spd,
    battlesWon: m.battlesWon,
    battlesLost: m.battlesLost,
    owner: m.owner ?? null,
    now: Date.now(),
  });
}

export function upsertBattle(
  db: DB,
  b: {
    challengeId: bigint;
    challenger: string;
    challengerToken: bigint;
    opponent: string;
    opponentToken: bigint;
    winner?: string;
    loser?: string;
    turns: number;
    draw: boolean;
    blockNumber: bigint;
    blockTimestamp: bigint;
    txHash: string;
  },
): void {
  db.prepare(
    `INSERT INTO battles
       (challenge_id, challenger, challenger_token, opponent, opponent_token, winner, loser, turns, draw, block_number, block_timestamp, tx_hash, ingested_at)
     VALUES (@challengeId, @challenger, @challengerToken, @opponent, @opponentToken, @winner, @loser, @turns, @draw, @blockNumber, @blockTimestamp, @txHash, @now)
     ON CONFLICT(challenge_id) DO UPDATE SET
       winner           = COALESCE(excluded.winner, battles.winner),
       loser            = COALESCE(excluded.loser, battles.loser),
       turns            = excluded.turns,
       draw             = excluded.draw,
       block_number     = excluded.block_number,
       block_timestamp  = excluded.block_timestamp,
       tx_hash          = excluded.tx_hash`,
  ).run({
    challengeId: Number(b.challengeId),
    challenger: b.challenger,
    challengerToken: Number(b.challengerToken),
    opponent: b.opponent,
    opponentToken: Number(b.opponentToken),
    winner: b.winner ?? null,
    loser: b.loser ?? null,
    turns: b.turns,
    draw: b.draw ? 1 : 0,
    blockNumber: Number(b.blockNumber),
    blockTimestamp: Number(b.blockTimestamp),
    txHash: b.txHash,
    now: Date.now(),
  });
}

export function getLastIndexedBlock(db: DB, chainId: number): number | null {
  const row = db
    .prepare(`SELECT last_block FROM indexed_block WHERE chain_id = ?`)
    .get(chainId) as { last_block: number } | undefined;
  return row?.last_block ?? null;
}

export function setLastIndexedBlock(db: DB, chainId: number, block: number): void {
  db.prepare(
    `INSERT INTO indexed_block (chain_id, last_block) VALUES (?, ?)
     ON CONFLICT(chain_id) DO UPDATE SET last_block = excluded.last_block`,
  ).run(chainId, block);
}

export type LeaderboardRow = {
  address: string;
  wins: number;
  total_xp: number;
  rank: number;
};

export function getLeaderboard(db: DB, limit: number): LeaderboardRow[] {
  // Aggregate from battles table: wins = count where address is the winner.
  return db
    .prepare(
      `SELECT
         winner AS address,
         COUNT(*) AS wins,
         COALESCE(SUM(m.xp), 0) AS total_xp,
         RANK() OVER (ORDER BY COUNT(*) DESC, COALESCE(SUM(m.xp), 0) DESC) AS rank
       FROM battles b
       LEFT JOIN monsters m
         ON m.token_id = CASE
           WHEN b.winner = b.challenger THEN b.challenger_token
           WHEN b.winner = b.opponent    THEN b.opponent_token
         END
       WHERE b.winner IS NOT NULL AND b.draw = 0
       GROUP BY b.winner
       ORDER BY wins DESC, total_xp DESC
       LIMIT ?`,
    )
    .all(limit) as LeaderboardRow[];
}

export type MonsterRow = {
  token_id: number;
  species_id: number;
  level: number;
  xp: number;
  dna: string;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  battles_won: number;
  battles_lost: number;
  owner: string | null;
};

export function getMonster(db: DB, tokenId: number): MonsterRow | undefined {
  return db
    .prepare(`SELECT * FROM monsters WHERE token_id = ?`)
    .get(tokenId) as MonsterRow | undefined;
}

export function getMonstersByOwner(db: DB, owner: string): MonsterRow[] {
  return db
    .prepare(`SELECT * FROM monsters WHERE owner = ? ORDER BY token_id`)
    .all(owner) as MonsterRow[];
}

export type BattleRow = {
  challenge_id: number;
  challenger: string;
  challenger_token: number;
  opponent: string;
  opponent_token: number;
  winner: string | null;
  loser: string | null;
  turns: number;
  draw: number;
  block_number: number;
  block_timestamp: number;
  tx_hash: string;
};

export function getBattle(db: DB, challengeId: number): BattleRow | undefined {
  return db
    .prepare(`SELECT * FROM battles WHERE challenge_id = ?`)
    .get(challengeId) as BattleRow | undefined;
}

export function getRecentBattles(db: DB, limit: number): BattleRow[] {
  return db
    .prepare(
      `SELECT * FROM battles ORDER BY block_number DESC, challenge_id DESC LIMIT ?`,
    )
    .all(limit) as BattleRow[];
}
