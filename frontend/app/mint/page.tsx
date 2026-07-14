"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { monsterNftAbi } from "@/lib/abis";
import { MONSTER_NFT_ADDRESS } from "@/lib/contracts";

type Stage = "none" | "minting" | "minted" | "hatching" | "hatched" | "error";

export default function MintPage() {
  const { address, isConnected } = useAccount();
  const [stage, setStage] = useState<Stage>("none");
  const [tokenId, setTokenId] = useState<bigint | null>(null);
  const [error, setError] = useState<string>("");

  const { data: hasMinted } = useReadContract({
    address: MONSTER_NFT_ADDRESS,
    abi: monsterNftAbi,
    functionName: "hasMintedEgg",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  const { writeContractAsync, data: mintTx } = useWriteContract();
  const { isLoading: isMintPending, isSuccess: mintSuccess } =
    useWaitForTransactionReceipt({ hash: mintTx });

  useEffect(() => {
    if (mintSuccess && mintTx && tokenId === null) {
      setStage("minted");
    }
  }, [mintSuccess, mintTx, tokenId]);

  async function handleMint() {
    if (!isConnected) {
      setError("Connect a wallet first.");
      return;
    }
    if (hasMinted) {
      setError("This wallet already has a Genesis Egg.");
      return;
    }
    try {
      setStage("minting");
      setError("");
      await writeContractAsync({
        address: MONSTER_NFT_ADDRESS,
        abi: monsterNftAbi,
        functionName: "mintGenesis",
      });
    } catch (e) {
      setError((e as Error).message ?? "Mint failed");
      setStage("error");
    }
  }

  async function handleHatch() {
    let id = tokenId;
    if (id === null) {
      const input = window.prompt(
        "Enter your Egg tokenId (find it in your wallet's NFT list or in the recent tx):",
      );
      if (!input) return;
      try {
        id = BigInt(input);
      } catch {
        setError("Invalid tokenId");
        return;
      }
      setTokenId(id);
    }
    try {
      setStage("hatching");
      await writeContractAsync({
        address: MONSTER_NFT_ADDRESS,
        abi: monsterNftAbi,
        functionName: "hatch",
        args: [id],
      });
    } catch (e) {
      setError((e as Error).message ?? "Hatch failed");
      setStage("error");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-10 pt-12 lg:grid-cols-12">
      <section className="lg:col-span-5">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#7AF0BA]">
          Genesis / Mint
        </p>
        <h1 className="mt-3 text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[0.95]">
          Your egg awaits.
        </h1>
        <p className="mt-4 max-w-md text-base text-[#B5BAC8]">
          One egg per wallet, forever. Hatch the egg to reveal a 12-species
          creature with its own 64-bit DNA.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={handleMint}
            disabled={!isConnected || Boolean(hasMinted) || isMintPending}
            className="rounded-full bg-[#7AF0BA] px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#0A0C13] transition-transform hover:scale-[1.04] disabled:opacity-50"
          >
            {isMintPending ? "Minting..." : hasMinted ? "Already minted" : "Mint my egg"}
          </button>
          {hasMinted ? (
            <button
              onClick={handleHatch}
              className="rounded-full border border-[#1F2333] px-5 py-3 text-sm uppercase tracking-[0.18em] text-[#B5BAC8] transition-colors hover:border-[#7AF0BA] hover:text-[#7AF0BA]"
            >
              Hatch
            </button>
          ) : null}
        </div>
        {!isConnected ? (
          <p className="mt-6 text-sm text-[#858DA1]">Connect your wallet to mint.</p>
        ) : null}
        {error ? (
          <p role="alert" className="mt-4 rounded-lg border border-[#FF6F7D] bg-[#22101a] px-4 py-3 text-sm text-[#FFB3C1]">
            {error}
          </p>
        ) : null}
        {stage === "hatched" || stage === "hatching" ? (
          <Link
            href={tokenId ? `/monster/${tokenId.toString()}` : "/train"}
            className="mt-6 inline-block text-sm text-[#7AF0BA] underline-offset-4 hover:underline"
          >
            View your monster →
          </Link>
        ) : null}
      </section>
      <section className="lg:col-span-7">
        <div className="relative aspect-[5/6] w-full overflow-hidden rounded-3xl border border-[#1F2333] bg-[#0E1119]">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 35%, rgba(122,240,186,0.35), transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: "perspective(900px) rotateY(-12deg) rotateX(6deg)",
              animation: "mm-float 6s ease-in-out infinite",
            }}
          >
            <Image
              src="/assets/marketing/poster-hero.png"
              alt="A MonadMon egg waiting to hatch"
              width={1122}
              height={1402}
              className="h-full w-2/3 object-contain"
              priority
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-6 font-mono text-[10px] uppercase tracking-[0.4em] text-[#858DA1]">
            <span>Stage 0 / egg</span>
            <span>DNA · unknown</span>
          </div>
        </div>
      </section>
    </div>
  );
}
