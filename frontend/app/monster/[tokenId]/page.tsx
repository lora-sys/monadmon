"use client";

import { useParams } from "next/navigation";
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
      <div className="text-center py-12 text-[#B5BAC8]">
        Loading monster #{tokenId.toString()}...
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-[#11141D] border border-[#232839] rounded-lg flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={isEgg ? "/assets/monsters/placeholder.png" : monsterArt(Number(monster.speciesId), Number(monster.stage), monster.dna)}
            alt={sp?.name ?? "Egg"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <header>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold">{sp?.name ?? "Egg"}</h1>
              {sp && (
                <span
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{ backgroundColor: elementColor(sp.element), color: "#0B0D14" }}
                >
                  {sp.element}
                </span>
              )}
              {sp && (
                <span
                  className="px-2 py-1 rounded text-xs font-semibold border"
                  style={{ borderColor: rarityColor(sp.rarity), color: rarityColor(sp.rarity) }}
                >
                  {sp.rarity}
                </span>
              )}
            </div>
            <p className="text-[#B5BAC8] text-sm mt-2">
              Token ID: <span className="font-mono">#{tokenId.toString()}</span>
              {owner && (
                <>
                  {" "}· Owner: <span className="font-mono">{owner.slice(0, 6)}…{owner.slice(-4)}</span>
                </>
              )}
            </p>
          </header>

          <div className="grid grid-cols-2 gap-3">
            <Stat label="HP" value={monster.hp} />
            <Stat label="ATK" value={monster.atk} />
            <Stat label="DEF" value={monster.def} />
            <Stat label="SPD" value={monster.spd} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#B5BAC8]">Level</span>
              <span className="font-bold">{monster.level.toString()}</span>
            </div>
            <div className="w-full bg-[#1A1E2A] rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-[#7AF0BA] transition-all"
                style={{ width: `${Math.min(100, (Number(monster.xp) / (Number(monster.level) * 100)) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[#6E7589]">
              <span>XP</span>
              <span>{monster.xp.toString()} / {(Number(monster.level) * 100).toString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-[#11141D] border border-[#232839] rounded p-3">
              <div className="text-[#6E7589] text-xs">Battles Won</div>
              <div className="font-bold text-lg">{monster.battlesWon.toString()}</div>
            </div>
            <div className="bg-[#11141D] border border-[#232839] rounded p-3">
              <div className="text-[#6E7589] text-xs">Battles Lost</div>
              <div className="font-bold text-lg">{monster.battlesLost.toString()}</div>
            </div>
          </div>

          <div className="bg-[#11141D] border border-[#232839] rounded p-3">
            <div className="text-[#6E7589] text-xs">DNA</div>
            <div className="font-mono text-sm break-all">0x{Number(monster.dna).toString(16).padStart(16, "0")}</div>
          </div>

          {isOwner && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleTrain}
                disabled={!canTrain}
                className="px-5 py-2 bg-[#7AF0BA] text-[#0B0D14] font-semibold rounded-md hover:bg-[#5cd891] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEgg ? "Hatch the egg (use Mint page)" : canTrain ? "Train" : `Train in ${formatRemaining(cooldownRemaining)}`}
              </button>
              {!isEgg && (
                <a
                  href="/arena"
                  className="px-5 py-2 border border-[#232839] rounded-md hover:border-[#7AF0BA]"
                >
                  Go to Arena
                </a>
              )}
            </div>
          )}
          {!isConnected && (
            <p className="text-[#B5BAC8] text-sm">Connect your wallet to interact with this Monster.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#11141D] border border-[#232839] rounded p-3">
      <div className="text-[#6E7589] text-xs">{label}</div>
      <div className="font-bold text-lg">{value.toString()}</div>
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
