import { afterEach, describe, expect, it } from "vitest";
import { openDB, upsertBattle, upsertMonster, type DB } from "../src/db.js";
import { createServer } from "../src/server.js";

const ALICE = "0x1000000000000000000000000000000000000001";
const BOB = "0x2000000000000000000000000000000000000002";

describe("read API", () => {
  let db: DB | undefined;

  afterEach(() => db?.close());

  it("serves live leaderboard data and owner lookups case-insensitively", async () => {
    db = openDB(":memory:");
    upsertMonster(db, {
      tokenId: 1n,
      speciesId: 4,
      level: 1,
      xp: 50,
      dna: "0x0000000000000001",
      hp: 100,
      atk: 100,
      def: 100,
      spd: 100,
      battlesWon: 1,
      battlesLost: 0,
      owner: BOB.toUpperCase().replace("0X", "0x"),
    });
    upsertBattle(db, {
      challengeId: 1n,
      challenger: ALICE,
      challengerToken: 2n,
      opponent: BOB,
      opponentToken: 1n,
      winner: BOB,
      loser: ALICE,
      turns: 3,
      draw: false,
      blockNumber: 12n,
      blockTimestamp: 1_700_000_012n,
      txHash: `0x${"1".padStart(64, "0")}`,
    });

    const app = createServer(db);
    const leaderboard = await app.request("/api/leaderboard?limit=10");
    expect(leaderboard.status).toBe(200);
    expect(await leaderboard.json()).toEqual([
      { address: BOB.toLowerCase(), wins: 1, total_xp: 50, rank: 1 },
    ]);

    const monsters = await app.request(`/api/monsters/owner/${BOB.toLowerCase()}`);
    expect(monsters.status).toBe(200);
    expect(await monsters.json()).toEqual([
      expect.objectContaining({ token_id: 1, owner: BOB.toLowerCase() }),
    ]);
  });

  it.each([
    "/api/leaderboard?limit=0",
    "/api/leaderboard?limit=-1",
    "/api/leaderboard?limit=1.5",
    "/api/leaderboard?limit=nan",
    "/api/battles/recent?limit=0",
  ])("rejects invalid pagination at %s", async (path) => {
    db = openDB(":memory:");
    const response = await createServer(db).request(path);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "invalid limit" });
  });
});
