import Link from "next/link";
import type { LeaderboardEntry } from "@/lib/indexer";

type LeaderboardViewProps = {
  entries?: LeaderboardEntry[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
};

export function LeaderboardView({
  entries,
  isLoading,
  isError,
  onRetry,
}: LeaderboardViewProps) {
  if (isLoading) {
    return (
      <div
        aria-busy="true"
        className="border-y border-[#232839] py-16 text-center text-sm text-[#B5BAC8]"
      >
        Loading rankings...
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="border-y border-[#4B3340] bg-[#1A1218] px-5 py-10 text-center"
      >
        <h2 className="text-base font-semibold text-[#FFB3C1]">
          Leaderboard unavailable
        </h2>
        <p className="mt-2 text-sm text-[#B5BAC8]">
          The indexer did not respond. Try again in a moment.
        </p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 border border-[#7AF0BA] px-4 py-2 text-sm font-semibold text-[#7AF0BA] hover:bg-[#7AF0BA] hover:text-[#0B0D14]"
          >
            Try again
          </button>
        ) : null}
      </div>
    );
  }

  if (!entries?.length) {
    return (
      <div role="status" aria-live="polite" className="border-y border-[#232839] py-16 text-center">
        <h2 className="text-base font-semibold">No ranked trainers yet</h2>
        <p className="mt-2 text-sm text-[#858DA1]">
          The first resolved battle will establish the league.
        </p>
        <Link
          href="/arena"
          className="mt-5 inline-block border border-[#7AF0BA] px-4 py-2 text-sm font-semibold text-[#7AF0BA] hover:bg-[#7AF0BA] hover:text-[#0B0D14]"
        >
          Enter the arena
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border-y border-[#232839]">
      <table className="w-full min-w-[340px] text-xs sm:min-w-[560px] sm:text-sm">
        <caption className="sr-only">
          Trainers ranked by verified battle wins, with total monster XP used as
          the tie-breaker
        </caption>
        <thead className="border-b border-[#232839] text-xs uppercase text-[#858DA1]">
          <tr>
            <th scope="col" className="w-12 px-2 py-3 text-left sm:w-20 sm:px-4">Rank</th>
            <th scope="col" className="px-2 py-3 text-left sm:px-4">Trainer</th>
            <th scope="col" className="px-2 py-3 text-right sm:px-4">Wins</th>
            <th scope="col" className="px-2 py-3 text-right sm:px-4">XP</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr
              key={entry.address}
              className="border-b border-[#232839] last:border-b-0 hover:bg-[#11141D]"
            >
              <td className="px-2 py-4 sm:px-4">
                <span className={`inline-flex h-7 w-7 items-center justify-center font-bold sm:h-8 sm:w-8 ${rankStyle(entry.rank)}`}>
                  {entry.rank}
                </span>
              </td>
              <td className="px-2 py-4 font-mono sm:px-4">
                <Link
                  href={`/profile/${entry.address}`}
                  className="hover:text-[#7AF0BA] hover:underline"
                  title={entry.address}
                >
                  <span className="sm:hidden">{shortMobileAddress(entry.address)}</span>
                  <span className="hidden sm:inline">{shortAddress(entry.address)}</span>
                </Link>
              </td>
              <td className="px-2 py-4 text-right font-bold text-[#7AF0BA] sm:px-4 sm:text-base">
                {entry.wins}
              </td>
              <td className="px-2 py-4 text-right tabular-nums text-[#B5BAC8] sm:px-4">
                {entry.total_xp.toLocaleString("en-US")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function shortAddress(address: string): string {
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

function shortMobileAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function rankStyle(rank: number): string {
  if (rank === 1) return "bg-[#FFD56B] text-[#0B0D14]";
  if (rank === 2) return "bg-[#C9A7FF] text-[#0B0D14]";
  if (rank === 3) return "bg-[#FFA07A] text-[#0B0D14]";
  return "bg-[#232839] text-[#B5BAC8]";
}
