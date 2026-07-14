"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { battleAbi } from "@/lib/abis";
import { BATTLE_ADDRESS } from "@/lib/contracts";

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
    <div className="space-y-12 pt-12">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#7AF0BA]">
          Arena / PvP
        </p>
        <h1 className="mt-3 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[0.95]">
          The arena.
        </h1>
        <p className="mt-4 max-w-xl text-base text-[#B5BAC8]">
          Challenge another trainer. Winner gets +50 XP and a leaderboard
          point.
        </p>
      </header>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChallenge();
          }}
          className="lg:col-span-5 rounded-3xl border border-[#1F2333] bg-[#0E1119] p-6"
        >
          <h2 className="text-lg font-semibold">Create a challenge</h2>
          <p className="mt-1 text-sm text-[#858DA1]">Two monsters. One battle.</p>
          <div className="mt-6 grid grid-cols-1 gap-3">
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
            type="submit"
            disabled={!isConnected || busy || !myTokenInput || !opponentInput || !oppTokenInput}
            className="mt-6 rounded-full bg-[#7AF0BA] px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0A0C13] transition-transform hover:scale-[1.04] disabled:opacity-50"
          >
            {busy ? "Sending..." : "Send challenge"}
          </button>
        </form>
        <section className="lg:col-span-7 space-y-3">
          <h2 className="text-lg font-semibold">Recent battles</h2>
          {total === 0 ? (
            <div className="rounded-2xl border border-[#1F2333] bg-[#0E1119] p-6 text-sm text-[#858DA1]">
              No battles yet. Create the first challenge.
            </div>
          ) : null}
          {challenges?.map((c, i) => {
            if (!c.result) return null;
            const ch = c.result;
            const isPending = ch.state === 1;
            const isResolved = ch.state === 2;
            return (
              <article
                key={i}
                className="rounded-2xl border border-[#1F2333] bg-[#0E1119] p-5"
              >
                <header className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#858DA1]">Challenge #{recent[i].toString()}</span>
                  <span
                    className={
                      isPending
                        ? "rounded-full bg-[#3a2a14] px-2 py-0.5 text-[#FFD56B]"
                        : isResolved
                        ? "rounded-full bg-[#13372a] px-2 py-0.5 text-[#7AF0BA]"
                        : "text-[#858DA1]"
                    }
                  >
                    {isPending ? "Pending" : isResolved ? "Resolved" : "Unknown"}
                  </span>
                </header>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#858DA1]">Challenger</p>
                    <p className="font-mono">{ch.challenger.slice(0, 6)}…{ch.challenger.slice(-4)}</p>
                    <Link
                      href={`/monster/${ch.challengerTokenId.toString()}`}
                      className="text-xs text-[#7AF0BA] hover:underline"
                    >
                      Token #{ch.challengerTokenId.toString()}
                    </Link>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#858DA1]">Opponent</p>
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
                  <p className="mt-3 text-sm">
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
                    className="mt-3 rounded-full border border-[#C9A7FF] px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-[#C9A7FF] transition-colors hover:bg-[#C9A7FF] hover:text-[#0A0C13] disabled:opacity-50"
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
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#858DA1]">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-[#1F2333] bg-[#141826] px-3 py-2 font-mono text-sm focus:border-[#7AF0BA] focus:outline-none"
      />
    </label>
  );
}
