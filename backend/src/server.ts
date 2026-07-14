import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  type DB,
  getBattle,
  getLeaderboard,
  getMonster,
  getMonstersByOwner,
  getRecentBattles,
} from "./db.js";

export function createServer(db: DB) {
  const app = new Hono();
  app.use("*", cors());

  app.get("/health", (c) => c.json({ status: "ok" }));

  app.get("/api/leaderboard", (c) => {
    const limit = parseLimit(c.req.query("limit"), 100, 1000);
    if (limit == null) return c.json({ error: "invalid limit" }, 400);
    return c.json(getLeaderboard(db, limit));
  });

  app.get("/api/monsters/:id", (c) => {
    const id = Number(c.req.param("id"));
    if (!Number.isInteger(id) || id < 0) {
      return c.json({ error: "invalid tokenId" }, 400);
    }
    const m = getMonster(db, id);
    if (!m) return c.json({ error: "not found" }, 404);
    return c.json(m);
  });

  app.get("/api/monsters/owner/:address", (c) => {
    const addr = c.req.param("address");
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      return c.json({ error: "invalid address" }, 400);
    }
    return c.json(getMonstersByOwner(db, addr.toLowerCase()));
  });

  app.get("/api/battles/recent", (c) => {
    const limit = parseLimit(c.req.query("limit"), 20, 200);
    if (limit == null) return c.json({ error: "invalid limit" }, 400);
    return c.json(getRecentBattles(db, limit));
  });

  app.get("/api/battles/:id", (c) => {
    const id = Number(c.req.param("id"));
    if (!Number.isInteger(id) || id < 0) {
      return c.json({ error: "invalid challengeId" }, 400);
    }
    const b = getBattle(db, id);
    if (!b) return c.json({ error: "not found" }, 404);
    return c.json(b);
  });

  return app;
}

function parseLimit(raw: string | undefined, fallback: number, max: number): number | null {
  const value = Number(raw ?? fallback);
  if (!Number.isInteger(value) || value < 1) return null;
  return Math.min(value, max);
}
