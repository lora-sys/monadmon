import {
  createPublicClient,
  http,
  parseAbiItem,
  type Address,
  type Hash,
  type PublicClient,
} from "viem";
import { anvil, monadTestnet } from "./chains.js";
import {
  getBattle,
  getLastIndexedBlock,
  openDB,
  setLastIndexedBlock,
  type DB,
  upsertBattle,
  upsertMonster,
} from "./db.js";
import { battleAbi, monsterNftAbi } from "./abis.js";

export type IndexerConfig = {
  rpcUrl: string;
  chainId: number;
  monsterNftAddress: Address;
  battleAddress: Address;
  confirmations: number;
  pollIntervalMs: number;
  db: DB;
};

type RuntimeConfig = Omit<IndexerConfig, "chainId" | "db">;

export type IndexerHandle = {
  stop: () => void;
  status: () => { lastBlock: number; chainId: number };
};

type ChainLog<TArgs> = {
  args: TArgs;
  blockNumber?: bigint | null;
  transactionHash?: Hash | null;
};

type MonsterState = {
  speciesId: number;
  level: number;
  xp: number;
  stage: number;
  _reserved0: number;
  _reserved1: number;
  dna: bigint;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  lastTrainedAt: bigint;
  battlesWon: number;
  battlesLost: number;
};

const eggMintedEvent = parseAbiItem(
  "event EggMinted(address indexed to, uint256 indexed tokenId)",
);
const monsterHatchedEvent = parseAbiItem(
  "event MonsterHatched(uint256 indexed tokenId, uint16 speciesId, uint64 dna, uint8 rarity)",
);
const trainedEvent = parseAbiItem(
  "event Trained(uint256 indexed tokenId, uint32 newXp, uint16 newAtk, uint64 trainedAt)",
);
const challengeCreatedEvent = battleAbi[0];
const challengeResolvedEvent = battleAbi[2];

const isLocal = (url: string) =>
  url.includes("127.0.0.1") || url.includes("localhost");

function pickChain(rpcUrl: string) {
  return isLocal(rpcUrl) ? anvil : monadTestnet;
}

export async function startIndexer(
  cfg: RuntimeConfig & { dbPath: string },
): Promise<IndexerHandle> {
  const chain = pickChain(cfg.rpcUrl);
  const client = createPublicClient({
    chain,
    transport: http(cfg.rpcUrl),
  }) as PublicClient;
  const db = openDB(cfg.dbPath);
  const chainId = chain.id;
  let lastBlock = getLastIndexedBlock(db, chainId) ?? -1;
  let running = true;
  let timer: ReturnType<typeof setTimeout> | null = null;

  async function tick() {
    if (!running) return;
    try {
      lastBlock = await syncIndexer(client, db, chainId, cfg, lastBlock);
    } catch (error) {
      log(`[indexer] tick error: ${(error as Error).message}`);
    }
    if (running) timer = setTimeout(tick, cfg.pollIntervalMs);
  }

  void tick();

  return {
    stop: () => {
      running = false;
      if (timer) clearTimeout(timer);
      db.close();
    },
    status: () => ({ lastBlock, chainId }),
  };
}

export async function syncIndexer(
  client: PublicClient,
  db: DB,
  chainId: number,
  cfg: RuntimeConfig,
  lastBlock: number,
): Promise<number> {
  const head = Number(await client.getBlockNumber());
  const target = head - cfg.confirmations;
  if (target < 0 || target <= lastBlock) return lastBlock;

  await processRange(client, db, cfg, lastBlock + 1, target);
  setLastIndexedBlock(db, chainId, target);
  log(`[indexer] advanced to block ${target}`);
  return target;
}

async function processRange(
  client: PublicClient,
  db: DB,
  cfg: RuntimeConfig,
  fromBlock: number,
  toBlock: number,
): Promise<void> {
  const range = { fromBlock: BigInt(fromBlock), toBlock: BigInt(toBlock) };
  const timestampCache = new Map<bigint, Promise<bigint>>();
  const getTimestamp = (blockNumber: bigint | null | undefined) => {
    if (blockNumber == null) return Promise.resolve(0n);
    const cached = timestampCache.get(blockNumber);
    if (cached) return cached;
    const timestamp = client
      .getBlock({ blockNumber })
      .then((block) => block.timestamp);
    timestampCache.set(blockNumber, timestamp);
    return timestamp;
  };

  const mintEvents = await client.getLogs({
    address: cfg.monsterNftAddress,
    event: eggMintedEvent,
    ...range,
  });
  for (const logEntry of mintEvents) {
    handleEggMinted(db, logEntry as ChainLog<{ to?: Address; tokenId?: bigint }>);
  }

  const hatchEvents = await client.getLogs({
    address: cfg.monsterNftAddress,
    event: monsterHatchedEvent,
    ...range,
  });
  for (const logEntry of hatchEvents) {
    const eventLog = logEntry as ChainLog<{ tokenId?: bigint }>;
    if (eventLog.args.tokenId != null) {
      await syncMonster(client, db, cfg, eventLog.args.tokenId);
    }
  }

  const trainEvents = await client.getLogs({
    address: cfg.monsterNftAddress,
    event: trainedEvent,
    ...range,
  });
  for (const logEntry of trainEvents) {
    const eventLog = logEntry as ChainLog<{ tokenId?: bigint }>;
    if (eventLog.args.tokenId != null) {
      await syncMonster(client, db, cfg, eventLog.args.tokenId);
    }
  }

  const createdEvents = await client.getLogs({
    address: cfg.battleAddress,
    event: challengeCreatedEvent,
    ...range,
  });
  for (const logEntry of createdEvents) {
    const eventLog = logEntry as ChainLog<{
      challengeId?: bigint;
      challenger?: Address;
      challengerTokenId?: bigint;
      opponent?: Address;
      opponentTokenId?: bigint;
    }>;
    await handleChallengeCreated(db, eventLog, await getTimestamp(eventLog.blockNumber));
  }

  const resolvedEvents = await client.getLogs({
    address: cfg.battleAddress,
    event: challengeResolvedEvent,
    ...range,
  });
  for (const logEntry of resolvedEvents) {
    const eventLog = logEntry as ChainLog<{
      challengeId?: bigint;
      winnerTokenId?: bigint;
      loserTokenId?: bigint;
      draw?: boolean;
      turns?: number;
    }>;
    await handleChallengeResolved(
      client,
      db,
      cfg,
      eventLog,
      await getTimestamp(eventLog.blockNumber),
    );
  }
}

function handleEggMinted(
  db: DB,
  eventLog: ChainLog<{ to?: Address; tokenId?: bigint }>,
): void {
  const { to, tokenId } = eventLog.args;
  if (!to || tokenId == null) return;
  db.prepare(
    `INSERT INTO monsters (token_id, species_id, level, xp, dna, hp, atk, def, spd, battles_won, battles_lost, owner, updated_at)
     VALUES (?, 0, 1, 0, '0x0', 0, 0, 0, 0, 0, 0, ?, ?)
     ON CONFLICT(token_id) DO UPDATE SET owner = excluded.owner, updated_at = excluded.updated_at`,
  ).run(Number(tokenId), to.toLowerCase(), Date.now());
}

async function handleChallengeCreated(
  db: DB,
  eventLog: ChainLog<{
    challengeId?: bigint;
    challenger?: Address;
    challengerTokenId?: bigint;
    opponent?: Address;
    opponentTokenId?: bigint;
  }>,
  blockTimestamp: bigint,
): Promise<void> {
  const { challengeId, challenger, challengerTokenId, opponent, opponentTokenId } =
    eventLog.args;
  if (
    challengeId == null ||
    !challenger ||
    challengerTokenId == null ||
    !opponent ||
    opponentTokenId == null
  ) {
    throw new Error("ChallengeCreated log is missing decoded arguments");
  }

  upsertBattle(db, {
    challengeId,
    challenger,
    challengerToken: challengerTokenId,
    opponent,
    opponentToken: opponentTokenId,
    turns: 0,
    draw: false,
    blockNumber: eventLog.blockNumber ?? 0n,
    blockTimestamp,
    txHash: eventLog.transactionHash ?? "0x",
  });
}

async function handleChallengeResolved(
  client: PublicClient,
  db: DB,
  cfg: RuntimeConfig,
  eventLog: ChainLog<{
    challengeId?: bigint;
    winnerTokenId?: bigint;
    loserTokenId?: bigint;
    draw?: boolean;
    turns?: number;
  }>,
  blockTimestamp: bigint,
): Promise<void> {
  const { challengeId, winnerTokenId, loserTokenId, draw, turns } = eventLog.args;
  if (
    challengeId == null ||
    winnerTokenId == null ||
    loserTokenId == null ||
    draw == null ||
    turns == null
  ) {
    throw new Error("ChallengeResolved log is missing decoded arguments");
  }

  const existing = getBattle(db, Number(challengeId));
  if (!existing) {
    throw new Error(`Challenge ${challengeId} resolved before it was indexed`);
  }

  const winner = draw ? undefined : participantForToken(existing, winnerTokenId);
  const loser = draw ? undefined : participantForToken(existing, loserTokenId);
  if (!draw && (!winner || !loser)) {
    throw new Error(`Challenge ${challengeId} resolved with an unknown token`);
  }

  upsertBattle(db, {
    challengeId,
    challenger: existing.challenger,
    challengerToken: BigInt(existing.challenger_token),
    opponent: existing.opponent,
    opponentToken: BigInt(existing.opponent_token),
    winner,
    loser,
    turns,
    draw,
    blockNumber: eventLog.blockNumber ?? 0n,
    blockTimestamp,
    txHash: eventLog.transactionHash ?? "0x",
  });

  if (!draw) {
    await Promise.all([
      syncMonster(client, db, cfg, BigInt(existing.challenger_token)),
      syncMonster(client, db, cfg, BigInt(existing.opponent_token)),
    ]);
  }
}

function participantForToken(
  battle: ReturnType<typeof getBattle> & {},
  tokenId: bigint,
): string | undefined {
  if (BigInt(battle.challenger_token) === tokenId) return battle.challenger;
  if (BigInt(battle.opponent_token) === tokenId) return battle.opponent;
  return undefined;
}

async function syncMonster(
  client: PublicClient,
  db: DB,
  cfg: RuntimeConfig,
  tokenId: bigint,
): Promise<void> {
  const monster = (await client.readContract({
    address: cfg.monsterNftAddress,
    abi: monsterNftAbi,
    functionName: "getMonster",
    args: [tokenId],
  })) as MonsterState;
  let owner: string | undefined;
  try {
    owner = (await client.readContract({
      address: cfg.monsterNftAddress,
      abi: monsterNftAbi,
      functionName: "ownerOf",
      args: [tokenId],
    })) as string;
  } catch {
    // The token may have been burned between the event and this read.
  }

  upsertMonster(db, {
    tokenId,
    speciesId: monster.speciesId,
    level: monster.level,
    xp: monster.xp,
    dna: `0x${monster.dna.toString(16).padStart(16, "0")}`,
    hp: monster.hp,
    atk: monster.atk,
    def: monster.def,
    spd: monster.spd,
    battlesWon: monster.battlesWon,
    battlesLost: monster.battlesLost,
    owner,
  });
}

function log(message: string): void {
  console.log(message);
}
