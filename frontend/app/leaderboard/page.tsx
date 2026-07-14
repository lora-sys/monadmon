"use client";

import { useQuery } from "@tanstack/react-query";
import { LeaderboardView } from "@/components/LeaderboardView";
import { fetchLeaderboard } from "@/lib/indexer";

export default function LeaderboardPage() {
  const leaderboard = useQuery({
    queryKey: ["leaderboard"],
    queryFn: ({ signal }) => fetchLeaderboard(signal),
    refetchInterval: 5_000,
    retry: 1,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-col gap-2 border-b border-[#232839] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">MonadMon League</h1>
          <p className="mt-1 text-sm text-[#B5BAC8]">
            Ranked by verified wins. Total monster XP breaks ties.
          </p>
        </div>
        <p className="text-xs uppercase text-[#858DA1]">Live on-chain standings</p>
      </header>

      <LeaderboardView
        entries={leaderboard.data}
        isLoading={leaderboard.isLoading}
        isError={leaderboard.isError}
        onRetry={() => void leaderboard.refetch()}
      />
    </div>
  );
}
