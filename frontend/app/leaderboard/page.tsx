import { speciesById } from "@/lib/species";

// For MVP, the leaderboard is a static demo page. Phase 2 swaps in an indexer.
const DEMO_ENTRIES: Array<{ rank: number; address: string; wins: number; xp: number; monsterName: string }> = [
  { rank: 1, address: "0xDragonMaster0000000000000000000000monster", wins: 12, xp: 820, monsterName: "ThunderWolf" },
  { rank: 2, address: "0xAlice0000000000000000000000000000000alice", wins: 9, xp: 660, monsterName: "EmberFox" },
  { rank: 3, address: "0xBob0000000000000000000000000000000000bob0", wins: 7, xp: 540, monsterName: "AquaPup" },
  { rank: 4, address: "0xCarol000000000000000000000000000000carol", wins: 5, xp: 410, monsterName: "ForestDeer" },
  { rank: 5, address: "0xDave00000000000000000000000000000000dave", wins: 3, xp: 290, monsterName: "VoltCat" },
];

export default function LeaderboardPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold">MonadMon League</h1>
        <p className="text-[#B5BAC8]">
          Top trainers ranked by battles won. (Phase 2 wires this to a live indexer.)
        </p>
      </header>

      <div className="bg-[#11141D] border border-[#232839] rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-[#232839] text-xs text-[#6E7589]">
            <tr>
              <th className="text-left p-3">Rank</th>
              <th className="text-left p-3">Trainer</th>
              <th className="text-left p-3">Monster</th>
              <th className="text-right p-3">Wins</th>
              <th className="text-right p-3">XP</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_ENTRIES.map((e) => {
              const sp = speciesById[parseInt(Object.keys(speciesById).find((k) => speciesById[parseInt(k)].name === e.monsterName) ?? "1")];
              return (
                <tr key={e.rank} className="border-b border-[#232839] last:border-b-0">
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        e.rank === 1
                          ? "bg-[#FFD56B] text-[#0B0D14]"
                          : e.rank === 2
                          ? "bg-[#C9A7FF] text-[#0B0D14]"
                          : e.rank === 3
                          ? "bg-[#FFA07A] text-[#0B0D14]"
                          : "bg-[#232839] text-[#B5BAC8]"
                      }`}
                    >
                      {e.rank}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-sm">
                    {e.address.slice(0, 8)}…{e.address.slice(-4)}
                  </td>
                  <td className="p-3 text-sm">{e.monsterName}</td>
                  <td className="p-3 text-right font-bold">{e.wins}</td>
                  <td className="p-3 text-right text-[#B5BAC8]">{e.xp}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[#6E7589] text-center">
        Real-time leaderboard lands in Phase 2 once the indexer is online.
      </p>
    </div>
  );
}
