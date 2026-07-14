"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useReadContracts } from "wagmi";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { monsterNftAbi } from "@/lib/abis";
import { MONSTER_NFT_ADDRESS } from "@/lib/contracts";
import { fetchOwnerTokenIds } from "@/lib/indexer";
import { speciesById, monsterArt } from "@/lib/species";

export default function ProfilePage() {
  const params = useParams<{ address: string }>();
  const addr = params.address as `0x${string}`;

  const ownerTokens = useQuery({
    queryKey: ["owner-monsters", addr.toLowerCase()],
    queryFn: ({ signal }) => fetchOwnerTokenIds(addr, signal),
    enabled: /^0x[a-fA-F0-9]{40}$/.test(addr),
  });

  const ids = ownerTokens.data?.slice(0, 12) ?? [];
  const total = ownerTokens.data?.length ?? 0;
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

      {ownerTokens.isLoading ? (
        <p aria-busy="true" className="py-8 text-center text-sm text-[#B5BAC8]">
          Loading on-chain collection...
        </p>
      ) : null}

      {ownerTokens.isError ? (
        <p role="alert" className="border-y border-[#4B3340] py-8 text-center text-sm text-[#FFB3C1]">
          Collection data is temporarily unavailable.
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {monsters?.map((m, i) => {
          if (!m.result) return null;
          const mon = m.result;
          const sp = mon.speciesId === 0 ? null : speciesById[Number(mon.speciesId)];
          return (
            <Link
              key={i}
              href={`/monster/${ids[i].toString()}`}
              className="bg-[#11141D] border border-[#232839] rounded p-3 hover:border-[#7AF0BA] transition-colors"
            >
              <div className="aspect-square bg-[#1A1E2A] rounded mb-2 overflow-hidden">
                <Image
                  src={
                    mon.speciesId === 0
                      ? "/assets/monsters/placeholder.svg"
                      : monsterArt(Number(mon.speciesId), Number(mon.stage), mon.dna)
                  }
                  alt={sp?.name ?? "Egg"}
                  width={384}
                  height={384}
                  sizes="(min-width: 1024px) 192px, (min-width: 640px) 30vw, 50vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="font-bold text-sm">{sp?.name ?? "Egg"}</div>
              <div className="text-xs text-[#858DA1]">
                Lv {mon.level.toString()} · {mon.battlesWon.toString()}W {mon.battlesLost.toString()}L
              </div>
            </Link>
          );
        })}
      </div>

      {!ownerTokens.isLoading && !ownerTokens.isError && total > 12 && (
        <p className="text-center text-xs text-[#858DA1]">
          Showing the 12 most recent monsters in this wallet.
        </p>
      )}

      {!ownerTokens.isLoading && !ownerTokens.isError && total === 0 && (
        <p className="text-[#858DA1] text-sm text-center py-8">
          This wallet has no monsters yet.
        </p>
      )}
    </div>
  );
}
