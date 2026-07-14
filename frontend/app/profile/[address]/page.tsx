"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useReadContracts } from "wagmi";
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
    <div className="space-y-10 pt-12">
      <header className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#7AF0BA]">
            Trainer / Profile
          </p>
          <h1
            className="mt-3 font-bold leading-[0.95] tracking-tight text-[clamp(2rem,5vw,3.75rem)]"
            title={addr}
          >
            {addr.slice(0, 8)}…
            <span className="text-[#858DA1]">{addr.slice(-6)}</span>
          </h1>
        </div>
        <div className="lg:col-span-5 self-end text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#858DA1]">
            Monsters
          </p>
          <p className="mt-1 text-4xl font-bold text-[#7AF0BA]">{total}</p>
        </div>
      </header>
      {ownerTokens.isLoading ? (
        <p aria-busy="true" className="rounded-2xl border border-[#1F2333] bg-[#0E1119] p-8 text-center text-sm text-[#B5BAC8]">
          Loading on-chain collection…
        </p>
      ) : null}
      {ownerTokens.isError ? (
        <p
          role="alert"
          className="rounded-2xl border border-[#FF6F7D] bg-[#22101a] p-8 text-center text-sm text-[#FFB3C1]"
        >
          Collection data is temporarily unavailable.
        </p>
      ) : null}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {monsters?.map((m, i) => {
          if (!m.result) return null;
          const mon = m.result;
          const sp = mon.speciesId === 0 ? null : speciesById[Number(mon.speciesId)];
          return (
            <Link
              key={ids[i].toString()}
              href={`/monster/${ids[i].toString()}`}
              className="group flex flex-col gap-3 rounded-3xl border border-[#1F2333] bg-[#0E1119] p-3 transition-colors hover:border-[#7AF0BA]/60"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#141826]">
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
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-sm font-semibold">{sp?.name ?? "Egg"}</p>
                <p className="font-mono text-xs text-[#858DA1]">
                  Lv {mon.level.toString()} · {mon.battlesWon.toString()}W {mon.battlesLost.toString()}L
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      {!ownerTokens.isLoading && !ownerTokens.isError && total === 0 ? (
        <p className="rounded-2xl border border-[#1F2333] bg-[#0E1119] p-8 text-center text-sm text-[#858DA1]">
          This wallet has no monsters yet.
        </p>
      ) : null}
      {!ownerTokens.isLoading && !ownerTokens.isError && total > 12 ? (
        <p className="text-center text-xs text-[#858DA1]">
          Showing the 12 most recent monsters in this wallet.
        </p>
      ) : null}
    </div>
  );
}
