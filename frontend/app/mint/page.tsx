"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
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
      setStage("hatched");
    } catch (e) {
      setError((e as Error).message ?? "Hatch failed");
      setStage("error");
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Your Genesis Egg</h1>
        <p className="text-[#B5BAC8]">
          One egg per wallet. The hatch reveals your Monster&apos;s species and DNA on-chain.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {stage === "none" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#11141D] border border-[#232839] rounded-md p-12 text-center"
          >
            <div className="text-7xl mb-6">🥚</div>
            {!isConnected && (
              <p className="text-[#B5BAC8] mb-4">Connect a wallet on Monad testnet to mint.</p>
            )}
            {isConnected && hasMinted && (
              <p className="text-[#7AF0BA] mb-4">
                Your wallet already has an Egg. Scroll down to hatch.
              </p>
            )}
            {isConnected && !hasMinted && (
              <p className="text-[#B5BAC8] mb-4">Ready to mint. One per wallet.</p>
            )}
            <button
              onClick={handleMint}
              disabled={!isConnected || hasMinted === true || isMintPending}
              className="px-6 py-3 bg-[#7AF0BA] text-[#0B0D14] font-semibold rounded-md hover:bg-[#5cd891] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMintPending ? "Minting..." : "Mint Egg"}
            </button>
            {error && <p className="mt-4 text-[#FF6F7D] text-sm">{error}</p>}
          </motion.div>
        )}

        {(stage === "minting" || stage === "minted") && (
          <motion.div
            key="minting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#11141D] border border-[#232839] rounded-md p-12 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="text-7xl mb-6 inline-block"
            >
              🥚
            </motion.div>
            <p className="text-[#B5BAC8] mb-6">
              {stage === "minting" ? "Minting on-chain..." : "Egg minted! Ready to hatch."}
            </p>
            {stage === "minted" && (
              <button
                onClick={handleHatch}
                className="px-6 py-3 bg-[#7AF0BA] text-[#0B0D14] font-semibold rounded-md hover:bg-[#5cd891] transition-colors"
              >
                Hatch
              </button>
            )}
          </motion.div>
        )}

        {stage === "hatching" && (
          <motion.div
            key="hatching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#11141D] border border-[#232839] rounded-md p-12 text-center"
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, -4, 4, 0], scale: [1, 1.15, 1.25, 1.4] }}
              transition={{ duration: 2.4 }}
              className="text-7xl mb-6 inline-block"
            >
              🥚
            </motion.div>
            <p className="text-[#B5BAC8]">Hatching on-chain...</p>
          </motion.div>
        )}

        {stage === "hatched" && tokenId !== null && (
          <motion.div
            key="hatched"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#11141D] border border-[#7AF0BA] rounded-md p-12 text-center space-y-4"
          >
            <div className="text-7xl">✨</div>
            <h2 className="text-2xl font-bold text-[#7AF0BA]">A MonadMon is born!</h2>
            <p className="text-[#B5BAC8]">
              Token ID: <span className="font-mono">{tokenId.toString()}</span>
            </p>
            <a
              href={`/monster/${tokenId.toString()}`}
              className="inline-block px-6 py-3 bg-[#7AF0BA] text-[#0B0D14] font-semibold rounded-md hover:bg-[#5cd891] transition-colors"
            >
              Meet your Monster
            </a>
          </motion.div>
        )}

        {stage === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#11141D] border border-[#FF6F7D] rounded-md p-12 text-center"
          >
            <div className="text-7xl mb-4">⚠️</div>
            <p className="text-[#FF6F7D] mb-4">{error || "Something went wrong"}</p>
            <button
              onClick={() => {
                setStage("none");
                setError("");
              }}
              className="px-6 py-3 border border-[#232839] rounded-md hover:border-[#7AF0BA]"
            >
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
