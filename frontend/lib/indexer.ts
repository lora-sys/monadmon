export type LeaderboardEntry = {
  address: `0x${string}`;
  wins: number;
  total_xp: number;
  rank: number;
};

type IndexedMonster = {
  token_id: number;
  owner: `0x${string}`;
};

const DEFAULT_INDEXER_URL = "http://127.0.0.1:3001";
const ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;

export async function fetchLeaderboard(signal?: AbortSignal): Promise<LeaderboardEntry[]> {
  const baseUrl = getIndexerUrl();
  const response = await fetch(`${baseUrl}/api/leaderboard?limit=100`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) {
    throw new Error(`Indexer returned HTTP ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || !payload.every(isLeaderboardEntry)) {
    throw new Error("Indexer returned an invalid leaderboard payload");
  }
  return payload;
}

export async function fetchOwnerTokenIds(
  address: `0x${string}`,
  signal?: AbortSignal,
): Promise<bigint[]> {
  if (!ADDRESS_PATTERN.test(address)) throw new Error("Invalid owner address");
  const response = await fetch(
    `${getIndexerUrl()}/api/monsters/owner/${address.toLowerCase()}`,
    { headers: { Accept: "application/json" }, signal },
  );
  if (!response.ok) {
    throw new Error(`Indexer returned HTTP ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || !payload.every(isIndexedMonster)) {
    throw new Error("Indexer returned an invalid monster payload");
  }
  return payload.map((monster) => BigInt(monster.token_id));
}

function getIndexerUrl(): string {
  return (process.env.NEXT_PUBLIC_INDEXER_URL ?? DEFAULT_INDEXER_URL).replace(/\/$/, "");
}

function isLeaderboardEntry(value: unknown): value is LeaderboardEntry {
  if (typeof value !== "object" || value == null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.address === "string" &&
    ADDRESS_PATTERN.test(entry.address) &&
    isNonNegativeInteger(entry.wins) &&
    isNonNegativeInteger(entry.total_xp) &&
    isPositiveInteger(entry.rank)
  );
}

function isIndexedMonster(value: unknown): value is IndexedMonster {
  if (typeof value !== "object" || value == null) return false;
  const monster = value as Record<string, unknown>;
  return (
    isPositiveInteger(monster.token_id) &&
    typeof monster.owner === "string" &&
    ADDRESS_PATTERN.test(monster.owner)
  );
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1;
}
