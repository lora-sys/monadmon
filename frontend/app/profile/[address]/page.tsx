"use client";

import { useParams } from "next/navigation";
import { useReadContracts } from "wagmi";
import { monsterNftAbi } from "@/lib/abis";
import { MONSTER_NFT_ADDRESS } from "@/lib/contracts";
import { speciesById, monsterArt } from "@/lib/species";

export default function ProfilePage() {
  const params = useParams<{ address: string }>();
  const addr = params.address as `0x${string}`;

  const { data: balance } = useReadContracts({
    contracts: [
      { address: MONSTER_NFT_ADDRESS, abi: monsterNftAbi, functionName: "balanceOf", args: [addr] },
    ],
    query: { enabled: Boolean(addr) },
  });

  const total = balance && balance[0]?.result ? Number(balance[0].result) : 0;
  const ids = Array.from({ length: Math.min(total, 12) }, (_, i) => BigInt(i + 1));
  const { data: monsters } = useReadContracts({
    contracts: ids.map((id) => ({
      address: MONSTER_NFT_ADDRESS,
      abi: monsterNftAbi,
      functionName: "getMonster" as const,
      args: [id],
    })),
    query: { enabled: ids.length > 0 },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold font-mono">
          {addr.slice(0, 8)}…{addr.slice(-4)}
        </h1>
        <p className="text-[#B5BAC8] text-sm">
          {total} monster{total === 1 ? "" : "s"} on-chain
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {monsters?.map((m, i) => {
          if (!m.result) return null;
          const mon = m.result;
          const sp = mon.speciesId === 0 ? null : speciesById[Number(mon.speciesId)];
          return (
            <a
              key={i}
              href={`/monster/${ids[i].toString()}`}
              className="bg-[#11141D] border border-[#232839] rounded p-3 hover:border-[#7AF0BA] transition-colors"
            >
              <div className="aspect-square bg-[#1A1E2A] rounded mb-2 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    mon.speciesId === 0
                      ? "/assets/monsters/placeholder.svg"
                      : monsterArt(Number(mon.speciesId), Number(mon.stage), mon.dna)
                  }
                  alt={sp?.name ?? "Egg"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="font-bold text-sm">{sp?.name ?? "Egg"}</div>
              <div className="text-xs text-[#6E7589]">
                Lv {mon.level.toString()} · {mon.battlesWon.toString()}W {mon.battlesLost.toString()}L
              </div>
            </a>
          );
        })}
      </div>

      {total === 0 && (
        <p className="text-[#6E7589] text-sm text-center py-8">
          This wallet has no monsters yet.
        </p>
      )}
    </div>
  );
}
