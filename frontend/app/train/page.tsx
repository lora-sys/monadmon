"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContracts, useWriteContract } from "wagmi";
import { monsterNftAbi } from "@/lib/abis";
import { MONSTER_NFT_ADDRESS } from "@/lib/contracts";
import { speciesById, monsterArt } from "@/lib/species";

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
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Train your Monsters</h1>
        <p className="text-[#B5BAC8]">
          Each train grants +30 XP and +2 ATK. Cooldown is 6 hours per monster.
        </p>
      </header>

      {!isConnected && (
        <div className="bg-[#11141D] border border-[#232839] rounded p-6 text-center text-[#B5BAC8]">
          Connect your wallet to see your monsters.
        </div>
      )}

      {isConnected && numMonsters === 0 && (
        <div className="bg-[#11141D] border border-[#232839] rounded p-6 text-center">
          <p className="text-[#B5BAC8] mb-3">You don&apos;t have any Monsters yet.</p>
          <a href="/mint" className="text-[#7AF0BA] underline">
            Mint your Genesis Egg →
          </a>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {monsters?.map((m, i) => {
          if (!m.result) return null;
          const mon = m.result;
          const sp = mon.speciesId === 0 ? null : speciesById[Number(mon.speciesId)];
          const isEgg = mon.speciesId === 0;
          const cooldownRemaining =
            Number(mon.lastTrainedAt) > 0 ? Math.max(0, Number(mon.lastTrainedAt) + COOLDOWN - now) : 0;
          const canTrain = !isEgg && cooldownRemaining === 0;
          return (
            <div key={i} className="bg-[#11141D] border border-[#232839] rounded p-4 space-y-3">
              <div className="aspect-square bg-[#1A1E2A] rounded overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={isEgg ? "/assets/monsters/placeholder.png" : monsterArt(Number(mon.speciesId), Number(mon.stage), mon.dna)}
                  alt={sp?.name ?? "Egg"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold">{sp?.name ?? "Egg"}</div>
                <div className="text-xs text-[#858DA1]">
                  Lv {mon.level.toString()} · ATK {mon.atk.toString()} · XP {mon.xp.toString()}
                </div>
              </div>
              {isEgg ? (
                <a
                  href="/mint"
                  className="block text-center px-3 py-2 border border-[#232839] rounded text-sm hover:border-[#7AF0BA]"
                >
                  Hatch the egg
                </a>
              ) : (
                <button
                  onClick={() => handleTrain(BigInt(i + 1))}
                  disabled={!canTrain || busyToken === (i + 1).toString()}
                  className="w-full px-3 py-2 bg-[#7AF0BA] text-[#0B0D14] font-semibold rounded text-sm hover:bg-[#5cd891] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {busyToken === (i + 1).toString()
                    ? "Training..."
                    : canTrain
                    ? "Train"
                    : `Ready in ${formatRemaining(cooldownRemaining)}`}
                </button>
              )}
            </div>
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
