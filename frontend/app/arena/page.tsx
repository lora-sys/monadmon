"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { battleAbi } from "@/lib/abis";
import { BATTLE_ADDRESS } from "@/lib/contracts";
import { SectionLabel } from "@/components/SectionLabel";
import { typeScale } from "@/lib/design";

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
      await battleWrite({
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
    <div className="mx-auto w-full max-w-[1400px] px-6 pt-24 sm:px-10 lg:pt-32">
      <header className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7">
          <SectionLabel index="Issue 04">Arena / PvP</SectionLabel>
          <h1
            className="mt-6 font-bold leading-[0.85] tracking-[-0.04em]"
            style={{ fontSize: typeScale.displayMd }}
          >
            The arena.
          </h1>
        </div>
        <p className="col-span-12 lg:col-span-5 self-end text-sm text-[#B5BAC8] sm:text-base">
          Challenge another trainer. Winner gets +50 XP and a
          leaderboard point.
        </p>
      </header>
      <section className="mt-16 grid grid-cols-12 gap-3">
        <form
          onSubmit={(e) => { e.preventDefault(); handleChallenge(); }}
          className="col-span-12 lg:col-span-5 border border-[#1F2333] bg-[#04060B] p-8"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#5B6378]">01 / Create</p>
          <h2 className="mt-3 text-2xl font-semibold">Send a challenge</h2>
          <p className="mt-2 text-sm text-[#858DA1]">Two monsters. One battle.</p>
          <div className="mt-8 space-y-3">
            <Field label="Your tokenId" value={myTokenInput} onChange={setMyTokenInput} placeholder="1" />
            <Field label="Opponent address" value={opponentInput} onChange={setOpponentInput} placeholder="0x..." />
            <Field label="Opponent tokenId" value={oppTokenInput} onChange={setOppTokenInput} placeholder="2" />
          </div>
          <button
            type="submit"
            disabled={!isConnected || busy || !myTokenInput || !opponentInput || !oppTokenInput}
            className="mt-8 inline-flex items-center gap-3 border border-[#7AF0BA] bg-[#7AF0BA]/5 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#7AF0BA] transition-colors hover:bg-[#7AF0BA] hover:text-[#04060B] disabled:opacity-40"
          >
            {busy ? "Sending..." : "Send challenge"}
          </button>
        </form>
        <section className="col-span-12 lg:col-span-7 space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#5B6378]">02 / Recent</p>
          <h2 className="text-2xl font-semibold">Recent battles</h2>
          {total === 0 ? (
            <div className="border border-[#1F2333] bg-[#04060B] p-8 text-sm text-[#858DA1]">
              No battles yet. Create the first challenge above.
            </div>
          ) : null}
          {challenges?.map((c, i) => {
            if (!c.result) return null;
            const ch = c.result;
            const isPending = ch.state === 1;
            const isResolved = ch.state === 2;
            return (
              <article key={i} className="border border-[#1F2333] bg-[#04060B] p-6">
                <header className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em]">
                  <span className="text-[#5B6378]">Challenge #{recent[i].toString()}</span>
                  <span
                    className={
                      isPending
                        ? "border border-yellow-700/50 bg-yellow-900/30 px-2 py-0.5 text-[#FFD56B]"
                        : isResolved
                        ? "border border-[#7AF0BA]/40 bg-[#7AF0BA]/15 px-2 py-0.5 text-[#7AF0BA]"
                        : "text-[#858DA1]"
                    }
                  >
                    {isPending ? "Pending" : isResolved ? "Resolved" : "Unknown"}
                  </span>
                </header>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#5B6378]">Challenger</p>
                    <p className="font-mono">{ch.challenger.slice(0, 6)}…{ch.challenger.slice(-4)}</p>
                    <Link
                      href={`/monster/${ch.challengerTokenId.toString()}`}
                      className="text-xs text-[#7AF0BA] hover:underline"
                    >
                      Token #{ch.challengerTokenId.toString()}
                    </Link>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#5B6378]">Opponent</p>
                    <p className="font-mono">{ch.opponent.slice(0, 6)}…{ch.opponent.slice(-4)}</p>
                    <Link
                      href={`/monster/${ch.opponentTokenId.toString()}`}
                      className="text-xs text-[#7AF0BA] hover:underline"
                    >
                      Token #{ch.opponentTokenId.toString()}
                    </Link>
                  </div>
                </div>
                {isResolved ? (
                  <p className="mt-4 text-sm">
                    {ch.draw ? (
                      <span className="text-[#858DA1]">Draw ({ch.turns.toString()} turns)</span>
                    ) : (
                      <span className="text-[#7AF0BA]">
                        Winner · token #{ch.winnerTokenId.toString()} ({ch.turns.toString()} turns)
                      </span>
                    )}
                  </p>
                ) : null}
                {isPending && ch.opponent.toLowerCase() === address?.toLowerCase() ? (
                  <button
                    onClick={() => handleAccept(recent[i])}
                    disabled={busy}
                    className="mt-4 border border-[#C9A7FF] px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-[#C9A7FF] transition-colors hover:bg-[#C9A7FF] hover:text-[#04060B] disabled:opacity-40"
                  >
                    Accept &amp; Resolve
                  </button>
                ) : null}
              </article>
            );
          })}
        </section>
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
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#5B6378]">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full border border-[#1F2333] bg-[#10131C] px-3 py-2 font-mono text-sm focus:border-[#7AF0BA] focus:outline-none"
      />
    </label>
  );
}
