import {
  createPublicClient,
  http,
  parseAbiItem,
  type Log,
  type PublicClient,
} from "viem";
import { anvil, monadTestnet } from "./chains.js";
import {
  openDB,
  type DB,
  getLastIndexedBlock,
  setLastIndexedBlock,
  upsertBattle,
  upsertMonster,
} from "./db.js";
import { monsterNftAbi, battleAbi } from "./abis.js";

export type IndexerConfig = {
  rpcUrl: string;
  chainId: number;
  monsterNftAddress: `0x${string}`;
  battleAddress: `0x${string}`;
  confirmations: number;
  pollIntervalMs: number;
  db: DB;
};

export type IndexerHandle = {
  stop: () => void;
  status: () => { lastBlock: number; chainId: number };
};

const isLocal = (url: string) => url.includes("127.0.0.1") || url.includes("localhost");

function pickChain(rpcUrl: string) {
  return isLocal(rpcUrl) ? anvil : monadTestnet;
}

export async function startIndexer(
  cfg: Omit<IndexerConfig, "chainId" | "db"> & { dbPath: string },
): Promise<IndexerHandle> {
  const chain = pickChain(cfg.rpcUrl);
  const client: PublicClient = createPublicClient({
    chain,
    transport: http(cfg.rpcUrl),
  }) as PublicClient;
  const db = openDB(cfg.dbPath);
  const chainId = chain.id;

  const stored = getLastIndexedBlock(db, chainId);
  // First run: start from genesis (block -1 so the first tick processes from 0).
  // Subsequent runs: resume from the last indexed block.
  let lastBlock: number = stored != null ? stored : -1;

  let running = true;
  let timer: ReturnType<typeof setTimeout> | null = null;

  async function tick() {
    if (!running) return;
    try {
      const head = await client.getBlockNumber();
      const target = Math.max(0, Number(head) - cfg.confirmations);
      if (target > lastBlock) {
        await processRange(client, db, chainId, cfg, lastBlock + 1, target);
        lastBlock = target;
        setLastIndexedBlock(db, chainId, lastBlock);
        console2(`[indexer] advanced to block ${lastBlock}`);
      }
    } catch (err) {
      console2(`[indexer] tick error: ${(err as Error).message}`);
    }
    if (running) {
      timer = setTimeout(tick, cfg.pollIntervalMs);
    }
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

async function processRange(
  client: PublicClient,
  db: DB,
  _chainId: number,
  cfg: Omit<IndexerConfig, "chainId" | "db">,
  fromBlock: number,
  toBlock: number,
): Promise<void> {
  const mintEvents = await client.getLogs({
    address: cfg.monsterNftAddress,
    event: parseAbiItem(
      "event EggMinted(address indexed to, uint256 indexed tokenId)",
    ),
    fromBlock: BigInt(fromBlock),
    toBlock: BigInt(toBlock),
  });
  for (const log of mintEvents) {
    handleEggMinted(db, log);
  }

  const hatchEvents = await client.getLogs({
    address: cfg.monsterNftAddress,
    event: parseAbiItem(
      "event MonsterHatched(uint256 indexed tokenId, uint16 speciesId, uint64 dna, uint8 rarity)",
    ),
    fromBlock: BigInt(fromBlock),
    toBlock: BigInt(toBlock),
  });
  for (const log of hatchEvents) {
    handleMonsterHatched(client, db, cfg, log);
  }

  const trainEvents = await client.getLogs({
    address: cfg.monsterNftAddress,
    event: parseAbiItem(
      "event Trained(uint256 indexed tokenId, uint32 newXp, uint16 newAtk, uint64 trainedAt)",
    ),
    fromBlock: BigInt(fromBlock),
    toBlock: BigInt(toBlock),
  });
  for (const log of trainEvents) {
    handleTrained(client, db, cfg, log);
  }

  const battleEvents = await client.getLogs({
    address: cfg.battleAddress,
    event: parseAbiItem(
      "event ChallengeCreated(uint256 indexed challengeId, address indexed challenger, uint256 indexed challengerTokenId, address indexed opponent, uint256 indexed opponentTokenId)",
    ),
    fromBlock: BigInt(fromBlock),
    toBlock: BigInt(toBlock),
  });
  for (const log of battleEvents) {
    handleChallengeCreated(db, log);
  }

  const resolvedEvents = await client.getLogs({
    address: cfg.battleAddress,
    event: parseAbiItem(
      "event ChallengeResolved(uint256 indexed challengeId, uint256 winnerTokenId, uint256 loserTokenId, bool draw, uint8 turns)",
    ),
    fromBlock: BigInt(fromBlock),
    toBlock: BigInt(toBlock),
  });
  for (const log of resolvedEvents) {
    handleChallengeResolved(client, db, cfg, log);
  }
}

function handleEggMinted(db: DB, log: any): void {
  const { to, tokenId } = log.args;
  if (!to || tokenId == null) return;
  // Token exists with egg state — owner set, everything else 0.
  // Use a no-op upsert that just sets the owner.
  db.prepare(
    `INSERT INTO monsters (token_id, species_id, level, xp, dna, hp, atk, def, spd, battles_won, battles_lost, owner, updated_at)
     VALUES (?, 0, 1, 0, '0x0', 0, 0, 0, 0, 0, 0, ?, ?)
     ON CONFLICT(token_id) DO UPDATE SET owner = excluded.owner, updated_at = excluded.updated_at`,
  ).run(Number(tokenId), to, Date.now());
}

async function handleMonsterHatched(client: PublicClient, db: DB, cfg: Omit<IndexerConfig, "chainId" | "db">, log: any): Promise<void> {
  const { tokenId } = log.args;
  if (tokenId == null) return;
  const m = (await client.readContract({
    address: cfg.monsterNftAddress,
    abi: monsterNftAbi,
    functionName: "getMonster",
    args: [tokenId],
  })) as unknown as unknown as { speciesId: number; level: number; xp: number; stage: number; _reserved0: number; _reserved1: number; dna: bigint; hp: number; atk: number; def: number; spd: number; lastTrainedAt: bigint; battlesWon: number; battlesLost: number; };
  let owner: string | undefined;
  try {
    owner = (await client.readContract({
      address: cfg.monsterNftAddress,
      abi: monsterNftAbi,
      functionName: "ownerOf",
      args: [tokenId],
    })) as string;
  } catch {
    // Token may have been burned; skip owner.
  }
  upsertMonster(db, {
    tokenId,
    speciesId: m.speciesId,
    level: m.level,
    xp: m.xp,
    dna: "0x" + (m.dna ?? 0n).toString(16).padStart(16, "0"),
    hp: m.hp,
    atk: m.atk,
    def: m.def,
    spd: m.spd,
    battlesWon: m.battlesWon,
    battlesLost: m.battlesLost,
    owner,
  });
}

async function handleTrained(client: PublicClient, db: DB, cfg: Omit<IndexerConfig, "chainId" | "db">, log: any): Promise<void> {
  const { tokenId } = log.args;
  if (tokenId == null) return;
  const m = (await client.readContract({
    address: cfg.monsterNftAddress,
    abi: monsterNftAbi,
    functionName: "getMonster",
    args: [tokenId],
  })) as unknown as unknown as { speciesId: number; level: number; xp: number; stage: number; _reserved0: number; _reserved1: number; dna: bigint; hp: number; atk: number; def: number; spd: number; lastTrainedAt: bigint; battlesWon: number; battlesLost: number; };
  let owner: string | undefined;
  try {
    owner = (await client.readContract({
      address: cfg.monsterNftAddress,
      abi: monsterNftAbi,
      functionName: "ownerOf",
      args: [tokenId],
    })) as string;
  } catch {}
  upsertMonster(db, {
    tokenId,
    speciesId: m.speciesId,
    level: m.level,
    xp: m.xp,
    dna: "0x" + (m.dna ?? 0n).toString(16).padStart(16, "0"),
    hp: m.hp,
    atk: m.atk,
    def: m.def,
    spd: m.spd,
    battlesWon: m.battlesWon,
    battlesLost: m.battlesLost,
    owner,
  });
}

function handleChallengeCreated(db: DB, log: any): void {
  const { challengeId, challenger, challengerTokenId, opponent, opponentTokenId } =
    log.args;
  if (
    challengeId == null ||
    !challenger ||
    challengerTokenId == null ||
    !opponent ||
    opponentTokenId == null
  )
    return;
  db.prepare(
    `INSERT INTO battles
       (challenge_id, challenger, challenger_token, opponent, opponent_token, winner, loser, turns, draw, block_number, block_timestamp, tx_hash, ingested_at)
     VALUES (?, ?, ?, ?, ?, NULL, NULL, 0, 0, ?, ?, ?, ?)
     ON CONFLICT(challenge_id) DO NOTHING`,
  ).run(
    Number(challengeId),
    challenger,
    Number(challengerTokenId),
    opponent,
    Number(opponentTokenId),
    Number(log.blockNumber ?? 0),
    Number(log.blockTimestamp ?? 0),
    log.transactionHash ?? "",
    Date.now(),
  );
}

async function handleChallengeResolved(client: PublicClient, db: DB, cfg: Omit<IndexerConfig, "chainId" | "db">, log: any): Promise<void> {
  const { challengeId } = log.args;
  if (challengeId == null) return;
  // Read the full Challenge struct to get winner/loser addresses.
  let winner: string | undefined;
  let loser: string | undefined;
  let turns = 0;
  let draw = false;
  try {
    const c = (await client.readContract({
      address: cfg.battleAddress,
      abi: battleAbi,
      functionName: "getChallenge",
      args: [challengeId],
    })) as unknown as { challenger: string; challengerTokenId: bigint; opponent: string; opponentTokenId: bigint; state: number; winnerTokenId: bigint; loserTokenId: bigint; turns: number; draw: boolean };
    const winnerTokenId = c.winnerTokenId;
    const loserTokenId = c.loserTokenId;
    if (winnerTokenId !== 0n) {
      winner = c.challenger.toLowerCase() === (winnerTokenId as any).toString().toLowerCase() ? c.challenger : c.opponent;
    }
    if (loserTokenId !== 0n) {
      loser = c.challenger.toLowerCase() === (loserTokenId as any).toString().toLowerCase() ? c.challenger : c.opponent;
    }
    turns = Number(c.turns ?? 0);
    draw = Boolean(c.draw ?? false);
  } catch {
    // Fall through — we still record with whatever we have.
  }
  // Read the existing battle row to keep challenger/opponent tokens.
  const existing = db
    .prepare(`SELECT challenger, challenger_token, opponent, opponent_token FROM battles WHERE challenge_id = ?`)
    .get(Number(challengeId)) as
    | { challenger: string; challenger_token: number; opponent: string; opponent_token: number }
    | undefined;
  if (!existing) {
    // If the indexer missed the ChallengeCreated (out-of-range), skip.
    return;
  }
  db.prepare(
    `UPDATE battles SET
       winner = COALESCE(?, winner),
       loser  = COALESCE(?, loser),
       turns  = ?,
       draw   = ?,
       block_number = ?,
       block_timestamp = ?,
       tx_hash = ?
     WHERE challenge_id = ?`,
  ).run(
    winner ?? null,
    loser ?? null,
    turns,
    draw ? 1 : 0,
    Number(log.blockNumber ?? 0),
    Number(log.blockTimestamp ?? 0),
    log.transactionHash ?? "",
    Number(challengeId),
  );
  // Also sync both monsters' battle counts + XP.
  if (winner && loser && !draw) {
    syncAfterBattle(client, db, cfg, existing.challenger_token, existing.opponent_token, winner, loser);
  }
  void upsertBattle; // unused, kept for future
}

async function syncAfterBattle(
  client: PublicClient,
  db: DB,
  cfg: Omit<IndexerConfig, "chainId" | "db">,
  tokenA: number,
  tokenB: number,
  winner: string,
  loser: string,
): Promise<void> {
  // Re-read both monsters' state so XP/battles counters reflect post-battle.
  for (const tokenId of [tokenA, tokenB]) {
    const m = (await client.readContract({
      address: cfg.monsterNftAddress,
      abi: monsterNftAbi,
      functionName: "getMonster",
      args: [BigInt(tokenId)],
    })) as unknown as unknown as { speciesId: number; level: number; xp: number; stage: number; _reserved0: number; _reserved1: number; dna: bigint; hp: number; atk: number; def: number; spd: number; lastTrainedAt: bigint; battlesWon: number; battlesLost: number; };
    let owner: string | undefined;
    try {
      owner = (await client.readContract({
        address: cfg.monsterNftAddress,
        abi: monsterNftAbi,
        functionName: "ownerOf",
        args: [BigInt(tokenId)],
      })) as string;
    } catch {}
    upsertMonster(db, {
      tokenId: BigInt(tokenId),
      speciesId: m.speciesId,
      level: m.level,
      xp: m.xp,
      dna: "0x" + (m.dna ?? 0n).toString(16).padStart(16, "0"),
      hp: m.hp,
      atk: m.atk,
      def: m.def,
      spd: m.spd,
      battlesWon: m.battlesWon,
      battlesLost: m.battlesLost,
      owner,
    });
  }
  // Touch winner/loser for clarity
  void winner; void loser;
}

function console2(msg: string) {
  // eslint-disable-next-line no-console
  console.log(msg);
}
