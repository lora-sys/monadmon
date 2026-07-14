"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { monsterNftAbi } from "@/lib/abis";
import { MONSTER_NFT_ADDRESS } from "@/lib/contracts";
import { speciesById, monsterArt, elementColor, rarityColor } from "@/lib/species";

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
      <div className="rounded-2xl border border-[#1F2333] bg-[#0E1119] p-10 text-center text-sm text-[#858DA1]">
        Loading monster #{tokenId.toString()}…
      </div>
    );
  }

  const sp = monster.speciesId === 0 ? null : speciesById[Number(monster.speciesId)];
  const isEgg = monster.speciesId === 0;
  const cooldownRemaining =
    Number(monster.lastTrainedAt) > 0
      ? Math.max(
          0,
          Number(monster.lastTrainedAt) + TRAIN_COOLDOWN_SECONDS - Math.floor(Date.now() / 1000),
        )
      : 0;
  const canTrain = !isEgg && cooldownRemaining === 0;
  const xpMax = Math.max(1, Number(monster.level) * 100);
  const xpProgress = Math.min(100, (Number(monster.xp) / xpMax) * 100);

  return (
    <div className="grid grid-cols-1 gap-10 pt-12 lg:grid-cols-12">
      <section className="lg:col-span-7">
        <div
          className="relative aspect-square overflow-hidden rounded-3xl border border-[#1F2333] bg-[#0E1119]"
          style={{ animation: "mm-breath 2.6s ease-in-out infinite" }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 30%, rgba(122,240,186,0.30), transparent 65%)",
            }}
          />
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
      <section className="lg:col-span-5 space-y-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#7AF0BA]">
            Creature / #{tokenId.toString()}
          </p>
          <h1 className="mt-3 text-[clamp(2.5rem,5vw,3.75rem)] font-bold leading-[0.95]">
            {sp?.name ?? "Egg"}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {sp ? (
              <span
                className="rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ backgroundColor: elementColor(sp.element), color: "#0A0C13" }}
              >
                {sp.element}
              </span>
            ) : null}
            {sp ? (
              <span
                className="rounded-full border px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ borderColor: rarityColor(sp.rarity), color: rarityColor(sp.rarity) }}
              >
                {sp.rarity}
              </span>
            ) : null}
          </div>
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
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#1F2333]">
            <div
              className="h-full bg-[#7AF0BA] transition-all"
              style={{ width: `${xpProgress}%` }}
              role="progressbar"
              aria-label="Monster experience progress"
              aria-valuemin={0}
              aria-valuemax={xpMax}
              aria-valuenow={Number(monster.xp)}
            />
          </div>
          <div className="mt-1 flex items-center justify-between font-mono text-xs text-[#858DA1]">
            <span>XP</span>
            <span>{monster.xp.toString()} / {xpMax.toString()}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-[#1F2333] bg-[#0E1119] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#858DA1]">Wins</p>
            <p className="mt-1 text-lg font-bold text-[#7AF0BA]">{monster.battlesWon.toString()}</p>
          </div>
          <div className="rounded-2xl border border-[#1F2333] bg-[#0E1119] p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#858DA1]">Losses</p>
            <p className="mt-1 text-lg font-bold">{monster.battlesLost.toString()}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-[#1F2333] bg-[#0E1119] p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#858DA1]">DNA</p>
          <p className="mt-1 break-all font-mono text-xs">
            0x{monster.dna.toString(16).padStart(16, "0")}
          </p>
        </div>
        <div className="rounded-2xl border border-[#1F2333] bg-[#0E1119] p-3 text-xs text-[#858DA1]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#858DA1]">Owner</p>
          <p className="mt-1 font-mono break-all">
            {owner ? `${owner.slice(0, 6)}…${owner.slice(-4)}` : "—"}
          </p>
        </div>
        {isOwner ? (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleTrain}
              disabled={!canTrain}
              aria-label={canTrain ? "Train this monster" : `Training locked, ${formatRemaining(cooldownRemaining)} remaining`}
              className="rounded-full bg-[#7AF0BA] px-5 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#0A0C13] transition-transform hover:scale-[1.04] disabled:opacity-50"
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
                className="rounded-full border border-[#1F2333] px-5 py-2 text-sm uppercase tracking-[0.18em] text-[#B5BAC8] transition-colors hover:border-[#7AF0BA] hover:text-[#7AF0BA]"
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
    <div className="rounded-2xl border border-[#1F2333] bg-[#0E1119] p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#858DA1]">{label}</p>
      <p className="mt-1 text-lg font-bold">{value.toString()}</p>
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
