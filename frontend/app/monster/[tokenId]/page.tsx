"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { monsterNftAbi } from "@/lib/abis";
import { MONSTER_NFT_ADDRESS } from "@/lib/contracts";
import { speciesById, monsterArt, elementColor, rarityColor } from "@/lib/species";
import { ParticleField } from "@/components/ParticleField";
import { SectionLabel } from "@/components/SectionLabel";
import { accentMesh, typeScale } from "@/lib/design";

const TRAIN_COOLDOWN_SECONDS = 6 * 60 * 60;

export default function MonsterDetailPage() {
  const params = useParams<{ tokenId: string }>();
  const tokenId = BigInt(params.tokenId);
  const { address, isConnected } = useAccount();

  const { data: monster } = useReadContract({
    address: MONSTER_NFT_ADDRESS,
    abi: monsterNftAbi,
    functionName: "getMonster",
    args: [tokenId],
    query: { enabled: Boolean(tokenId) },
  });

  const { data: owner } = useReadContract({
    address: MONSTER_NFT_ADDRESS,
    abi: monsterNftAbi,
    functionName: "ownerOf",
    args: [tokenId],
    query: { enabled: Boolean(tokenId) },
  });

  const { writeContractAsync: train } = useWriteContract();
  const isOwner = owner && address && owner.toLowerCase() === address.toLowerCase();

  async function handleTrain() {
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
    }
  }

  if (!monster) {
    return (
      <div className="mx-auto mt-32 max-w-md border border-[#1F2333] bg-[#04060B] p-10 text-center text-sm text-[#858DA1]">
        Loading monster #{tokenId.toString()}…
      </div>
    );
  }

  const sp = monster.speciesId === 0 ? null : speciesById[Number(monster.speciesId)];
  const isEgg = monster.speciesId === 0;
  const cooldownRemaining =
    Number(monster.lastTrainedAt) > 0
      ? Math.max(0, Number(monster.lastTrainedAt) + TRAIN_COOLDOWN_SECONDS - Math.floor(Date.now() / 1000))
      : 0;
  const canTrain = !isEgg && cooldownRemaining === 0;
  const xpMax = Math.max(1, Number(monster.level) * 100);
  const xpProgress = Math.min(100, (Number(monster.xp) / xpMax) * 100);

  return (
    <div className="relative grid min-h-[100svh] grid-cols-12 gap-6 overflow-hidden px-6 pt-24 sm:px-10 lg:pt-32">
      <ParticleField height="100%" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: accentMesh.detail }}
      />
      <section className="col-span-12 lg:col-span-7 flex flex-col justify-center">
        <div
          className="relative aspect-square w-full max-w-[640px] border border-[#1F2333] bg-[#04060B]"
          style={{ animation: "mm-breath 2.6s ease-in-out infinite" }}
        >
          <Image
            src={isEgg ? "/assets/monsters/placeholder.svg" : monsterArt(Number(monster.speciesId), Number(monster.stage), monster.dna)}
            alt={sp?.name ?? "Egg"}
            width={768}
            height={768}
            sizes="(min-width: 1024px) 600px, 100vw"
            className="relative h-full w-full object-cover"
            priority
            unoptimized
          />
        </div>
      </section>
      <section className="col-span-12 lg:col-span-5 flex flex-col justify-center space-y-6">
        <SectionLabel index={`Creature / #${tokenId.toString()}`}>Dossier</SectionLabel>
        <h1
          className="font-bold leading-[0.85] tracking-[-0.04em]"
          style={{ fontSize: typeScale.displayMd }}
        >
          {sp?.name ?? "Egg"}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {sp ? (
            <span
              className="px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em]"
              style={{ backgroundColor: elementColor(sp.element), color: "#04060B" }}
            >
              {sp.element}
            </span>
          ) : null}
          {sp ? (
            <span
              className="border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em]"
              style={{ borderColor: rarityColor(sp.rarity), color: rarityColor(sp.rarity) }}
            >
              {sp.rarity}
            </span>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="HP" value={monster.hp} />
          <Stat label="ATK" value={monster.atk} />
          <Stat label="DEF" value={monster.def} />
          <Stat label="SPD" value={monster.spd} />
        </div>
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#B5BAC8]">Level</span>
            <span className="font-bold">{monster.level.toString()}</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden bg-[#1F2333]">
            <div
              className="h-full bg-[#7AF0BA]"
              style={{ width: `${xpProgress}%` }}
              role="progressbar"
              aria-label="Monster experience progress"
              aria-valuemin={0}
              aria-valuemax={xpMax}
              aria-valuenow={Number(monster.xp)}
            />
          </div>
          <div className="mt-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-[#858DA1]">
            <span>XP</span>
            <span>{monster.xp.toString()} / {xpMax.toString()}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="border border-[#1F2333] bg-[#04060B] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#5B6378]">Wins</p>
            <p className="mt-1 text-2xl font-bold text-[#7AF0BA]">{monster.battlesWon.toString()}</p>
          </div>
          <div className="border border-[#1F2333] bg-[#04060B] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#5B6378]">Losses</p>
            <p className="mt-1 text-2xl font-bold">{monster.battlesLost.toString()}</p>
          </div>
        </div>
        <div className="border border-[#1F2333] bg-[#04060B] p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#5B6378]">DNA</p>
          <p className="mt-1 break-all font-mono text-xs">
            0x{monster.dna.toString(16).padStart(16, "0")}
          </p>
        </div>
        <div className="border border-[#1F2333] bg-[#04060B] p-3 text-xs text-[#858DA1]">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#5B6378]">Owner</p>
          <p className="mt-1 break-all font-mono">
            {owner ? `${owner.slice(0, 6)}…${owner.slice(-4)}` : "—"}
          </p>
        </div>
        {isOwner ? (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleTrain}
              disabled={!canTrain}
              aria-label={canTrain ? "Train this monster" : `Training locked, ${formatRemaining(cooldownRemaining)} remaining`}
              className="border border-[#7AF0BA] bg-[#7AF0BA]/5 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#7AF0BA] transition-colors hover:bg-[#7AF0BA] hover:text-[#04060B] disabled:opacity-40"
            >
              {isEgg
                ? "Hatch the egg"
                : canTrain
                ? "Train"
                : `Ready in ${formatRemaining(cooldownRemaining)}`}
            </button>
            {!isEgg ? (
              <Link
                href="/arena"
                className="border border-[#1F2333] px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-[#B5BAC8] transition-colors hover:border-[#7AF0BA] hover:text-[#7AF0BA]"
              >
                Go to Arena
              </Link>
            ) : null}
          </div>
        ) : null}
        {!isConnected ? (
          <p className="text-xs text-[#858DA1]">Connect your wallet to interact with this monster.</p>
        ) : null}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-[#1F2333] bg-[#04060B] p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#5B6378]">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value.toString()}</p>
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
