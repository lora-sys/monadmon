"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-[#232839] bg-[#11141D]/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🥚</span>
          <span className="text-xl font-bold text-[#7AF0BA]">MonadMon</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/mint" className="hover:text-[#7AF0BA] transition-colors">
            Mint
          </Link>
          <Link href="/train" className="hover:text-[#7AF0BA] transition-colors">
            Train
          </Link>
          <Link href="/arena" className="hover:text-[#7AF0BA] transition-colors">
            Arena
          </Link>
          <Link href="/leaderboard" className="hover:text-[#7AF0BA] transition-colors">
            Leaderboard
          </Link>
          <ConnectButton
            accountStatus="address"
            chainStatus="icon"
            showBalance={false}
          />
        </nav>
      </div>
    </header>
  );
}
