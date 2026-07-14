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
import { SectionLabel } from "@/components/SectionLabel";
import { typeScale } from "@/lib/design";

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
    <div className="mx-auto w-full max-w-[1400px] px-6 pt-24 sm:px-10 lg:pt-32">
      <header className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9">
          <SectionLabel index="Issue 06">Trainer / Profile</SectionLabel>
          <h1
            className="mt-6 font-bold leading-[0.85] tracking-[-0.04em] text-[#F5F6FA]"
            style={{ fontSize: typeScale.displayMd }}
            title={addr}
          >
            {addr.slice(0, 8)}…
            <span className="text-[#5B6378]">{addr.slice(-6)}</span>
          </h1>
        </div>
        <div className="col-span-12 lg:col-span-3 self-end text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#5B6378]">Monsters</p>
          <p
            className="mt-2 font-bold leading-none text-[#7AF0BA]"
            style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
          >
            {total}
          </p>
        </div>
      </header>
      {ownerTokens.isLoading ? (
        <p aria-busy="true" className="mt-20 border border-[#1F2333] bg-[#04060B] p-16 text-center text-sm text-[#B5BAC8]">
          Loading on-chain collection…
        </p>
      ) : null}
      {ownerTokens.isError ? (
        <p role="alert" className="mt-20 border border-[#FF6F7D] bg-[#22101a] p-8 text-center text-sm text-[#FFB3C1]">
          Collection data is temporarily unavailable.
        </p>
      ) : null}
      <div className="mt-16 grid grid-cols-12 gap-3 sm:grid-cols-6 lg:grid-cols-8">
        {monsters?.map((m, i) => {
          if (!m.result) return null;
          const mon = m.result;
          const sp = mon.speciesId === 0 ? null : speciesById[Number(mon.speciesId)];
          return (
            <Link
              key={ids[i].toString()}
              href={`/monster/${ids[i].toString()}`}
              className="group col-span-6 sm:col-span-3 lg:col-span-2 flex flex-col gap-3 border border-[#1F2333] bg-[#04060B] p-3 transition-colors hover:border-[#7AF0BA]"
            >
              <div className="relative aspect-square overflow-hidden border border-[#1F2333] bg-[#10131C]">
                <Image
                  src={mon.speciesId === 0
                    ? "/assets/monsters/placeholder.svg"
                    : monsterArt(Number(mon.speciesId), Number(mon.stage), mon.dna)}
                  alt={sp?.name ?? "Egg"}
                  width={384}
                  height={384}
                  sizes="(min-width: 1024px) 192px, (min-width: 640px) 30vw, 50vw"
                  unoptimized
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div>
                <p className="text-sm font-semibold">{sp?.name ?? "Egg"}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#858DA1]">
                  Lv {mon.level.toString()} · {mon.battlesWon.toString()}W {mon.battlesLost.toString()}L
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      {!ownerTokens.isLoading && !ownerTokens.isError && total === 0 ? (
        <p className="mt-20 border border-[#1F2333] bg-[#04060B] p-8 text-center text-sm text-[#858DA1]">
          This wallet has no monsters yet.
        </p>
      ) : null}
      {!ownerTokens.isLoading && !ownerTokens.isError && total > 12 ? (
        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-[#858DA1]">
          Showing the 12 most recent monsters in this wallet.
        </p>
      ) : null}
    </div>
  );
}
