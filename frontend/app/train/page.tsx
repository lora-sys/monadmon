"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useReadContracts, useWriteContract } from "wagmi";
import { monsterNftAbi } from "@/lib/abis";
import { MONSTER_NFT_ADDRESS } from "@/lib/contracts";
import { speciesById, monsterArt } from "@/lib/species";
import { SectionLabel } from "@/components/SectionLabel";
import { typeScale } from "@/lib/design";

const COOLDOWN = 6 * 60 * 60;

export default function TrainPage() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync: train } = useWriteContract();
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [busyToken, setBusyToken] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 5000);
    return () => clearInterval(t);
  }, []);

  const { data: balance } = useReadContracts({
    contracts: address
      ? [{ address: MONSTER_NFT_ADDRESS, abi: monsterNftAbi, functionName: "balanceOf", args: [address] }]
      : [],
    query: { enabled: Boolean(address) },
  });

  const numMonsters = balance && balance[0]?.result ? Number(balance[0].result) : 0;
  const tokenIds = Array.from({ length: numMonsters }, (_, i) => BigInt(i + 1));

  const { data: monsters } = useReadContracts({
    contracts: tokenIds.map((id) => ({
      address: MONSTER_NFT_ADDRESS,
      abi: monsterNftAbi,
      functionName: "getMonster" as const,
      args: [id],
    })),
    query: { enabled: tokenIds.length > 0 },
  });

  async function handleTrain(tokenId: bigint) {
    setBusyToken(tokenId.toString());
    try {
      await train({
        address: MONSTER_NFT_ADDRESS,
        abi: monsterNftAbi,
        functionName: "train",
        args: [tokenId],
      });
      window.location.reload();
    } catch (e) {
      alert((e as Error).message ?? "Train failed");
    } finally {
      setBusyToken(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pt-24 sm:px-10 lg:pt-32">
      <header className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <SectionLabel index="Issue 03">Training / Growth</SectionLabel>
          <h1
            className="mt-6 font-bold leading-[0.85] tracking-[-0.04em]"
            style={{ fontSize: typeScale.displayMd }}
          >
            Train your creatures.
          </h1>
        </div>
        <p className="col-span-12 lg:col-span-5 self-end text-sm text-[#B5BAC8] sm:text-base">
          Each session grants{" "}
          <span className="text-[#7AF0BA]">+30 XP</span> and{" "}
          <span className="text-[#7AF0BA]">+2 ATK</span>. Cooldown is six
          hours per monster.
        </p>
      </header>
      {!isConnected ? (
        <div className="mt-20 border border-[#1F2333] bg-[#04060B] p-16 text-center text-sm text-[#858DA1]">
          Connect your wallet to see your monsters.
        </div>
      ) : null}
      {isConnected && numMonsters === 0 ? (
        <div className="mt-20 border border-[#1F2333] bg-[#04060B] p-16 text-center">
          <p className="text-[#B5BAC8]">You don&apos;t have any monsters yet.</p>
          <Link
            href="/mint"
            className="mt-4 inline-block text-sm text-[#7AF0BA] underline-offset-4 hover:underline"
          >
            Mint your Genesis Egg →
          </Link>
        </div>
      ) : null}
      <div className="mt-16 grid grid-cols-12 gap-3 sm:grid-cols-6 lg:grid-cols-8">
        {monsters?.map((m, i) => {
          if (!m.result) return null;
          const mon = m.result;
          const sp = mon.speciesId === 0 ? null : speciesById[Number(mon.speciesId)];
          const isEgg = mon.speciesId === 0;
          const cooldownRemaining =
            Number(mon.lastTrainedAt) > 0
              ? Math.max(0, Number(mon.lastTrainedAt) + COOLDOWN - now)
              : 0;
          const canTrain = !isEgg && cooldownRemaining === 0;
          const progress = isEgg
            ? 0
            : Math.min(100, (Number(mon.xp) / (Number(mon.level) * 100)) * 100);
          return (
            <article
              key={i}
              className="group col-span-12 flex flex-col gap-4 border border-[#1F2333] bg-[#04060B] p-5 transition-colors hover:border-[#7AF0BA] sm:col-span-3 lg:col-span-2"
            >
              <div className="relative aspect-square overflow-hidden border border-[#1F2333] bg-[#10131C]">
                <Image
                  src={isEgg ? "/assets/monsters/placeholder.svg" : monsterArt(Number(mon.speciesId), Number(mon.stage), mon.dna)}
                  alt={sp?.name ?? "Egg"}
                  width={384}
                  height={384}
                  unoptimized
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div>
                <p className="text-lg font-semibold">{sp?.name ?? "Egg"}</p>
                <p className="font-mono text-xs text-[#858DA1]">
                  Lv {mon.level.toString()} · ATK {mon.atk.toString()} · XP {mon.xp.toString()}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[#5B6378]">
                  <span>Cooldown</span>
                  <span className="font-mono">
                    {isEgg ? "—" : cooldownRemaining === 0 ? "Ready" : formatRemaining(cooldownRemaining)}
                  </span>
                </div>
                <div className="mt-1 h-1 w-full overflow-hidden bg-[#1F2333]">
                  <div
                    className="h-full bg-[#7AF0BA]"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-label="Training progress"
                    aria-valuenow={Number(mon.xp)}
                    aria-valuemin={0}
                    aria-valuemax={Number(mon.level) * 100}
                  />
                </div>
              </div>
              {isEgg ? (
                <Link
                  href="/mint"
                  className="block border border-[#1F2333] px-3 py-2 text-center text-[10px] uppercase tracking-[0.3em] text-[#B5BAC8] transition-colors hover:border-[#7AF0BA] hover:text-[#7AF0BA]"
                >
                  Hatch the egg
                </Link>
              ) : (
                <button
                  onClick={() => handleTrain(BigInt(i + 1))}
                  disabled={!canTrain || busyToken === (i + 1).toString()}
                  aria-label={canTrain ? "Train this monster" : `Training locked, ${formatRemaining(cooldownRemaining)} remaining`}
                  className="w-full border border-[#7AF0BA] bg-[#7AF0BA]/5 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#7AF0BA] transition-colors hover:bg-[#7AF0BA] hover:text-[#04060B] disabled:opacity-40"
                >
                  {busyToken === (i + 1).toString()
                    ? "Training..."
                    : canTrain
                    ? "Train"
                    : `Ready in ${formatRemaining(cooldownRemaining)}`}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function formatRemaining(seconds: number): string {
  if (seconds <= 0) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
