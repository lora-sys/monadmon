"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract, useReadContracts, useWriteContract } from "wagmi";
import Link from "next/link";
import { monsterNftAbi, battleAbi } from "@/lib/abis";
import { MONSTER_NFT_ADDRESS, BATTLE_ADDRESS } from "@/lib/contracts";
import { speciesById, monsterArt } from "@/lib/species";

export default function ArenaPage() {
  const { address, isConnected } = useAccount();
  const { data: challengeCount } = useReadContract({
    address: BATTLE_ADDRESS,
    abi: battleAbi,
    functionName: "challengeCount",
  });
  const total = challengeCount ? Number(challengeCount) : 0;
  const recent = Array.from({ length: Math.min(total, 10) }, (_, i) => BigInt(total - i));

  const { data: challenges } = useReadContracts({
    contracts: recent.map((id) => ({
      address: BATTLE_ADDRESS,
      abi: battleAbi,
      functionName: "getChallenge" as const,
      args: [id],
    })),
    query: { enabled: recent.length > 0 },
  });

  const { writeContractAsync: battleWrite } = useWriteContract();
  const [opponentInput, setOpponentInput] = useState("");
  const [oppTokenInput, setOppTokenInput] = useState("");
  const [myTokenInput, setMyTokenInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleChallenge() {
    if (!myTokenInput || !opponentInput || !oppTokenInput) return;
    setBusy(true);
    try {
      const cid = await battleWrite({
        address: BATTLE_ADDRESS,
        abi: battleAbi,
        functionName: "challenge",
        args: [BigInt(myTokenInput), opponentInput as `0x${string}`, BigInt(oppTokenInput)],
      });
      alert(`Challenge created. Share challengeId with the opponent. (Tx confirmed)`);
      window.location.reload();
    } catch (e) {
      alert((e as Error).message ?? "Challenge failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleAccept(cid: bigint) {
    setBusy(true);
    try {
      await battleWrite({
        address: BATTLE_ADDRESS,
        abi: battleAbi,
        functionName: "acceptAndResolve",
        args: [cid],
      });
      window.location.reload();
    } catch (e) {
      alert((e as Error).message ?? "Accept failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Battle Arena</h1>
        <p className="text-[#B5BAC8]">
          Challenge another player. Winner gets +50 XP and a leaderboard point.
        </p>
      </header>

      <section className="bg-[#11141D] border border-[#232839] rounded-md p-6 space-y-4">
        <h2 className="text-xl font-semibold">Create a challenge</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field
            label="Your tokenId"
            value={myTokenInput}
            onChange={setMyTokenInput}
            placeholder="1"
          />
          <Field
            label="Opponent address"
            value={opponentInput}
            onChange={setOpponentInput}
            placeholder="0x..."
          />
          <Field
            label="Opponent tokenId"
            value={oppTokenInput}
            onChange={setOppTokenInput}
            placeholder="2"
          />
        </div>
        <button
          onClick={handleChallenge}
          disabled={!isConnected || busy || !myTokenInput || !opponentInput || !oppTokenInput}
          className="px-5 py-2 bg-[#7AF0BA] text-[#0B0D14] font-semibold rounded-md hover:bg-[#5cd891] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy ? "Sending..." : "Challenge"}
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Recent battles</h2>
        {total === 0 && (
          <div className="text-[#6E7589] text-sm">No battles yet. Create the first challenge above.</div>
        )}
        <div className="space-y-3">
          {challenges?.map((c, i) => {
            if (!c.result) return null;
            const ch = c.result;
            const isPending = ch.state === 1;
            const isResolved = ch.state === 2;
            return (
              <div key={i} className="bg-[#11141D] border border-[#232839] rounded-md p-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-[#6E7589]">Challenge #{recent[i].toString()}</span>
                  <span className="text-xs">
                    {isPending ? (
                      <span className="px-2 py-0.5 rounded bg-yellow-900/30 text-yellow-300">
                        PENDING
                      </span>
                    ) : isResolved ? (
                      <span className="px-2 py-0.5 rounded bg-[#7AF0BA]/20 text-[#7AF0BA]">
                        RESOLVED
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[#6E7589] text-xs">Challenger</div>
                    <div className="font-mono">
                      {ch.challenger.slice(0, 6)}…{ch.challenger.slice(-4)}
                    </div>
                    <Link
                      href={`/monster/${ch.challengerTokenId.toString()}`}
                      className="text-[#7AF0BA] text-xs"
                    >
                      Token #{ch.challengerTokenId.toString()}
                    </Link>
                  </div>
                  <div>
                    <div className="text-[#6E7589] text-xs">Opponent</div>
                    <div className="font-mono">
                      {ch.opponent.slice(0, 6)}…{ch.opponent.slice(-4)}
                    </div>
                    <Link
                      href={`/monster/${ch.opponentTokenId.toString()}`}
                      className="text-[#7AF0BA] text-xs"
                    >
                      Token #{ch.opponentTokenId.toString()}
                    </Link>
                  </div>
                </div>
                {isResolved && (
                  <div className="text-sm">
                    {ch.draw ? (
                      <span className="text-[#6E7589]">Draw ({ch.turns.toString()} turns)</span>
                    ) : (
                      <span className="text-[#7AF0BA]">
                        Winner: token #{ch.winnerTokenId.toString()} ({ch.turns.toString()} turns)
                      </span>
                    )}
                  </div>
                )}
                {isPending && ch.opponent.toLowerCase() === address?.toLowerCase() && (
                  <button
                    onClick={() => handleAccept(recent[i])}
                    disabled={busy}
                    className="px-4 py-1.5 bg-[#C9A7FF] text-[#0B0D14] text-sm font-semibold rounded hover:bg-[#b594e8] disabled:opacity-50"
                  >
                    Accept &amp; Resolve
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-[#6E7589] block mb-1">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#1A1E2A] border border-[#232839] rounded px-3 py-2 text-sm font-mono focus:border-[#7AF0BA] focus:outline-none"
      />
    </label>
  );
}
