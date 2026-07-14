"use client";

import { useQuery } from "@tanstack/react-query";
import { LeaderboardView } from "@/components/LeaderboardView";
import { SectionLabel } from "@/components/SectionLabel";
import { fetchLeaderboard } from "@/lib/indexer";
import { typeScale } from "@/lib/design";

export default function LeaderboardPage() {
  const leaderboard = useQuery({
    queryKey: ["leaderboard"],
    queryFn: ({ signal }) => fetchLeaderboard(signal),
    refetchInterval: 15_000,
    retry: 0,
  });

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pt-24 sm:px-10 lg:pt-32">
      <header className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9">
          <SectionLabel index="Issue 05">The League</SectionLabel>
          <h1
            className="mt-6 font-bold leading-[0.85] tracking-[-0.04em]"
            style={{ fontSize: typeScale.displayMd }}
          >
            The strongest trainers.
          </h1>
        </div>
        <p className="col-span-12 lg:col-span-3 self-end text-sm text-[#858DA1]">
          Ranked by verified wins. Total monster XP breaks ties. Updated
          every 15 seconds.
        </p>
      </header>
      <div className="mt-16">
        <LeaderboardView
          entries={leaderboard.data}
          isLoading={leaderboard.isLoading}
          isError={leaderboard.isError}
          onRetry={() => void leaderboard.refetch()}
        />
      </div>
    </div>
  );
}
