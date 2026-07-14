"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { monsterNftAbi } from "@/lib/abis";
import { MONSTER_NFT_ADDRESS } from "@/lib/contracts";
import { ParticleField } from "@/components/ParticleField";
import { SectionLabel } from "@/components/SectionLabel";
import { accentMesh, typeScale } from "@/lib/design";

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
    if (mintSuccess && mintTx && tokenId === null) setStage("minted");
  }, [mintSuccess, mintTx, tokenId]);

  async function handleMint() {
    if (!isConnected) { setError("Connect a wallet first."); return; }
    if (hasMinted) { setError("This wallet already has a Genesis Egg."); return; }
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
      const input = window.prompt("Enter your Egg tokenId:");
      if (!input) return;
      try { id = BigInt(input); } catch { setError("Invalid tokenId"); return; }
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
    <div className="relative grid min-h-[100svh] grid-cols-12 gap-6 overflow-hidden px-6 pt-24 sm:px-10 lg:pt-32">
      <ParticleField height="100%" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: accentMesh.hero }}
      />
      <section className="col-span-12 lg:col-span-7 flex flex-col justify-center">
        <SectionLabel index="Issue 02">Genesis / Mint</SectionLabel>
        <h1
          className="mt-6 font-bold leading-[0.85] tracking-[-0.04em]"
          style={{ fontSize: typeScale.displayMd }}
        >
          Your egg awaits.
        </h1>
        <p className="mt-6 max-w-md text-base text-[#B5BAC8] sm:text-lg">
          One egg per wallet, forever. Hatch the egg to reveal a 12-species
          creature with its own 64-bit DNA.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            onClick={handleMint}
            disabled={!isConnected || Boolean(hasMinted) || isMintPending}
            className="inline-flex items-center gap-3 border border-[#7AF0BA] bg-[#7AF0BA]/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#7AF0BA] transition-colors hover:bg-[#7AF0BA] hover:text-[#04060B] disabled:opacity-40"
          >
            {isMintPending ? "Minting..." : hasMinted ? "Already minted" : "Mint my egg"}
          </button>
          {hasMinted ? (
            <button
              onClick={handleHatch}
              className="inline-flex items-center gap-3 border border-[#1F2333] px-8 py-4 text-sm uppercase tracking-[0.3em] text-[#B5BAC8] transition-colors hover:border-[#7AF0BA] hover:text-[#7AF0BA]"
            >
              Hatch
            </button>
          ) : null}
        </div>
        {!isConnected ? (
          <p className="mt-6 text-sm text-[#858DA1]">Connect your wallet to mint.</p>
        ) : null}
        {error ? (
          <p
            role="alert"
            className="mt-4 max-w-md border border-[#FF6F7D] bg-[#22101a] px-4 py-3 text-sm text-[#FFB3C1]"
          >
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
      <section className="col-span-12 lg:col-span-5 relative">
        <div className="relative aspect-[4/5] w-full max-w-[440px] mx-auto">
          <div
            aria-hidden
            className="absolute -inset-10 -z-10"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(122,240,186,0.40), transparent 65%)",
            }}
          />
          <div
            className="relative h-full w-full"
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
          <p className="absolute bottom-0 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-[#5B6378]">
            Stage 0 / egg · DNA · unknown
          </p>
        </div>
      </section>
    </div>
  );
}
