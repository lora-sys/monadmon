import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchLeaderboard, fetchOwnerTokenIds } from "../lib/indexer";

const ENTRY = {
  address: "0x2000000000000000000000000000000000000002",
  wins: 1,
  total_xp: 50,
  rank: 1,
};

describe("fetchLeaderboard", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.NEXT_PUBLIC_INDEXER_URL;
  });

  it("loads and validates live standings", async () => {
    process.env.NEXT_PUBLIC_INDEXER_URL = "http://indexer.test/";
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify([ENTRY]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchLeaderboard()).resolves.toEqual([ENTRY]);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://indexer.test/api/leaderboard?limit=100",
      expect.objectContaining({ headers: { Accept: "application/json" } }),
    );
  });

  it("rejects malformed API data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify([{ ...ENTRY, wins: -1 }]))),
    );
    await expect(fetchLeaderboard()).rejects.toThrow("invalid leaderboard payload");
  });

  it("surfaces non-success responses", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("down", { status: 503 })));
    await expect(fetchLeaderboard()).rejects.toThrow("HTTP 503");
  });
});

describe("fetchOwnerTokenIds", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns the owner's actual indexed token IDs", async () => {
    const owner = "0x2000000000000000000000000000000000000002" as const;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify([
          { token_id: 2, owner },
          { token_id: 11, owner },
        ])),
      ),
    );

    await expect(fetchOwnerTokenIds(owner)).resolves.toEqual([2n, 11n]);
  });

  it("rejects malformed owner data", async () => {
    const owner = "0x2000000000000000000000000000000000000002" as const;
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify([
      { token_id: 0, owner },
    ]))));
    await expect(fetchOwnerTokenIds(owner)).rejects.toThrow("invalid monster payload");
  });
});
