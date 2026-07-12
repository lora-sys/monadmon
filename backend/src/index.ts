import { serve } from "@hono/node-server";
import { createServer } from "./server.js";
import { startIndexer } from "./indexer.js";

const PORT = Number(process.env.PORT ?? 3001);
const RPC_URL = process.env.RPC_URL ?? "http://127.0.0.1:8545";
const MONSTER_NFT_ADDRESS = (process.env.MONSTER_NFT_ADDRESS ??
  "0x0000000000000000000000000000000000000000") as `0x${string}`;
const BATTLE_ADDRESS = (process.env.BATTLE_ADDRESS ??
  "0x0000000000000000000000000000000000000000") as `0x${string}`;
const CONFIRMATIONS = Number(process.env.CONFIRMATIONS ?? 5);
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS ?? 2000);
const DB_PATH = process.env.DB_PATH ?? "data/monadmon.db";

async function main() {
  // 1. Start indexer
  const indexer = await startIndexer({
    rpcUrl: RPC_URL,
    monsterNftAddress: MONSTER_NFT_ADDRESS,
    battleAddress: BATTLE_ADDRESS,
    confirmations: CONFIRMATIONS,
    pollIntervalMs: POLL_INTERVAL_MS,
    dbPath: DB_PATH,
  });
  console.log(`[indexer] started: ${JSON.stringify(indexer.status())}`);

  // 2. Start HTTP server
  const { openDB } = await import("./db.js");
  const db = openDB(DB_PATH);
  const app = createServer(db);

  serve({ fetch: app.fetch, port: PORT });
  console.log(`[server] listening on :${PORT}`);

  process.on("SIGINT", () => {
    console.log("[shutdown] SIGINT received");
    indexer.stop();
    db.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
