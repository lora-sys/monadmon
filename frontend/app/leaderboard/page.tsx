"use client";

import { useQuery } from "@tanstack/react-query";
import { LeaderboardView } from "@/components/LeaderboardView";
import { fetchLeaderboard } from "@/lib/indexer";

export default function LeaderboardPage() {
  const leaderboard = useQuery({
    queryKey: ["leaderboard"],
    queryFn: ({ signal }) => fetchLeaderboard(signal),
    refetchInterval: 15_000,
    retry: 0,
  });

  return (
    <div className="space-y-10 pt-12">
      <header className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#7AF0BA]">
            The League
          </p>
          <h1 className="mt-3 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95]">
            The strongest trainers.
          </h1>
        </div>
        <p className="lg:col-span-5 self-end text-base text-[#858DA1]">
          Ranked by verified wins. Total monster XP breaks ties. Updated
          every 15 seconds as the indexer materializes each battle.
        </p>
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
