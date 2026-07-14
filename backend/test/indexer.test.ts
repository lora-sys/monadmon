import {
  decodeEventLog,
  encodeAbiParameters,
  encodeEventTopics,
  type PublicClient,
} from "viem";
import { afterEach, describe, expect, it, vi } from "vitest";
import { battleAbi } from "../src/abis.js";
import {
  getBattle,
  getLastIndexedBlock,
  getLeaderboard,
  getMonster,
  openDB,
  type DB,
} from "../src/db.js";
import { syncIndexer } from "../src/indexer.js";

const ALICE = "0x1000000000000000000000000000000000000001" as const;
const BOB = "0x2000000000000000000000000000000000000002" as const;
const MONSTER = "0x3000000000000000000000000000000000000003" as const;
const BATTLE = "0x4000000000000000000000000000000000000004" as const;
const TX_CREATED = `0x${"1".padStart(64, "0")}` as const;
const TX_RESOLVED = `0x${"2".padStart(64, "0")}` as const;

describe("battle event indexing", () => {
  let db: DB | undefined;

  afterEach(() => db?.close());

  it("matches the Solidity indexed layout and decodes both token IDs", () => {
    const event = battleAbi.find((item) => item.type === "event" && item.name === "ChallengeCreated");
    expect(event?.inputs.map((input) => input.indexed)).toEqual([
      true,
      true,
      false,
      true,
      false,
    ]);

    const decoded = decodeEventLog({
      abi: battleAbi,
      data: encodeAbiParameters(
        [{ type: "uint256" }, { type: "uint256" }],
        [1n, 2n],
      ),
      topics: challengeCreatedTopics(),
    });

    expect(decoded.eventName).toBe("ChallengeCreated");
    expect(decoded.args).toMatchObject({
      challengeId: 7n,
      challenger: ALICE,
      challengerTokenId: 1n,
      opponent: BOB,
      opponentTokenId: 2n,
    });
  });

  it("replays a resolved battle once and resumes idempotently", async () => {
    db = openDB(":memory:");
    const created = challengeCreatedLog();
    const resolved = challengeResolvedLog();
    const getLogs = vi.fn(async (params: unknown) => {
      const eventName = (params as { event: { name: string } }).event.name;
      if (eventName === "ChallengeCreated") return [created];
      if (eventName === "ChallengeResolved") return [resolved];
      return [];
    });
    const readContract = vi.fn(async (params: unknown) => {
      const request = params as { functionName: string; args: readonly [bigint] };
      const tokenId = request.args[0];
      if (request.functionName === "ownerOf") return tokenId === 1n ? ALICE : BOB;
      if (request.functionName === "getMonster") {
        return {
          speciesId: tokenId === 1n ? 1 : 4,
          level: 1,
          xp: tokenId === 1n ? 0 : 50,
          stage: 1,
          _reserved0: 0,
          _reserved1: 0,
          dna: tokenId,
          hp: 100,
          atk: 100,
          def: 100,
          spd: 100,
          lastTrainedAt: 0n,
          battlesWon: tokenId === 1n ? 0 : 1,
          battlesLost: tokenId === 1n ? 1 : 0,
        };
      }
      throw new Error(`Unexpected contract read: ${request.functionName}`);
    });
    const client = {
      getBlockNumber: vi.fn(async () => 20n),
      getLogs,
      getBlock: vi.fn(async ({ blockNumber }: { blockNumber: bigint }) => ({
        timestamp: 1_700_000_000n + blockNumber,
      })),
      readContract,
    } as unknown as PublicClient;
    const config = {
      rpcUrl: "http://127.0.0.1:8545",
      monsterNftAddress: MONSTER,
      battleAddress: BATTLE,
      confirmations: 0,
      pollIntervalMs: 10,
    };

    const firstLastBlock = await syncIndexer(client, db, 31_337, config, -1);
    expect(firstLastBlock).toBe(20);
    expect(getLastIndexedBlock(db, 31_337)).toBe(20);
    expect(getBattle(db, 7)).toEqual(expect.objectContaining({
      challenge_id: 7,
      challenger: ALICE.toLowerCase(),
      challenger_token: 1,
      opponent: BOB.toLowerCase(),
      opponent_token: 2,
      winner: BOB.toLowerCase(),
      loser: ALICE.toLowerCase(),
      turns: 4,
      draw: 0,
      block_number: 12,
      block_timestamp: 1_700_000_012,
      tx_hash: TX_RESOLVED,
    }));
    expect(getMonster(db, 2)).toEqual(expect.objectContaining({
      owner: BOB.toLowerCase(),
      xp: 50,
      battles_won: 1,
    }));
    expect(getLeaderboard(db, 10)).toEqual([
      { address: BOB.toLowerCase(), wins: 1, total_xp: 50, rank: 1 },
    ]);

    const secondLastBlock = await syncIndexer(client, db, 31_337, config, firstLastBlock);
    expect(secondLastBlock).toBe(20);
    expect(getLogs).toHaveBeenCalledTimes(5);
    expect(db.prepare("SELECT COUNT(*) AS count FROM battles").get()).toEqual({ count: 1 });
  });
});

function challengeCreatedLog() {
  const decoded = decodeEventLog({
    abi: battleAbi,
    data: encodeAbiParameters(
      [{ type: "uint256" }, { type: "uint256" }],
      [1n, 2n],
    ),
    topics: challengeCreatedTopics(),
  });
  return {
    args: decoded.args,
    blockNumber: 10n,
    transactionHash: TX_CREATED,
  };
}

function challengeResolvedLog() {
  const decoded = decodeEventLog({
    abi: battleAbi,
    data: encodeAbiParameters(
      [
        { type: "uint256" },
        { type: "uint256" },
        { type: "bool" },
        { type: "uint8" },
      ],
      [2n, 1n, false, 4],
    ),
    topics: encodeEventTopics({
      abi: battleAbi,
      eventName: "ChallengeResolved",
      args: { challengeId: 7n },
    }) as [`0x${string}`, ...`0x${string}`[]],
  });
  return {
    args: decoded.args,
    blockNumber: 12n,
    transactionHash: TX_RESOLVED,
  };
}

function challengeCreatedTopics(): [`0x${string}`, ...`0x${string}`[]] {
  return encodeEventTopics({
    abi: battleAbi,
    eventName: "ChallengeCreated",
    args: {
      challengeId: 7n,
      challenger: ALICE,
      opponent: BOB,
    },
  }) as [`0x${string}`, ...`0x${string}`[]];
}
