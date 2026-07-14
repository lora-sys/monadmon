import { afterEach, describe, expect, it } from "vitest";
import {
  getLeaderboard,
  openDB,
  upsertBattle,
  upsertMonster,
  type DB,
} from "../src/db.js";

const ALICE = "0x1000000000000000000000000000000000000001";
const BOB = "0x2000000000000000000000000000000000000002";

describe("leaderboard queries", () => {
  let db: DB | undefined;

  afterEach(() => db?.close());

  it("ranks wins first and counts each monster XP only once", () => {
    db = openDB(":memory:");
    seedMonster(db, 1n, ALICE, 80);
    seedMonster(db, 2n, BOB, 50);
    seedMonster(db, 3n, BOB, 25);

    seedBattle(db, 1n, ALICE, 1n, BOB, 2n, BOB);
    seedBattle(db, 2n, ALICE, 1n, BOB, 2n, BOB);
    seedBattle(db, 3n, BOB, 3n, ALICE, 1n, ALICE);

    expect(getLeaderboard(db, 10)).toEqual([
      { address: BOB.toLowerCase(), wins: 2, total_xp: 75, rank: 1 },
      { address: ALICE.toLowerCase(), wins: 1, total_xp: 80, rank: 2 },
    ]);
  });
});

function seedMonster(db: DB, tokenId: bigint, owner: string, xp: number): void {
  upsertMonster(db, {
    tokenId,
    speciesId: Number(tokenId),
    level: 1,
    xp,
    dna: "0x0000000000000001",
    hp: 100,
    atk: 100,
    def: 100,
    spd: 100,
    battlesWon: 0,
    battlesLost: 0,
    owner,
  });
}

function seedBattle(
  db: DB,
  challengeId: bigint,
  challenger: string,
  challengerToken: bigint,
  opponent: string,
  opponentToken: bigint,
  winner: string,
): void {
  upsertBattle(db, {
    challengeId,
    challenger,
    challengerToken,
    opponent,
    opponentToken,
    winner,
    loser: winner === challenger ? opponent : challenger,
    turns: 4,
    draw: false,
    blockNumber: 10n + challengeId,
    blockTimestamp: 1_700_000_000n + challengeId,
    txHash: `0x${challengeId.toString(16).padStart(64, "0")}`,
  });
}
