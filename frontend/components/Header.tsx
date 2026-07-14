"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-[#232839] bg-[#11141D]/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap sm:gap-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🥚</span>
          <span className="text-xl font-bold text-[#7AF0BA]">MonadMon</span>
        </Link>
        <div className="ml-auto sm:hidden">
          <ConnectButton accountStatus="avatar" chainStatus="icon" showBalance={false} />
        </div>
        <nav
          aria-label="Primary"
          className="order-3 grid w-full grid-cols-4 border-t border-[#232839] pt-3 text-center text-xs sm:order-none sm:ml-auto sm:flex sm:w-auto sm:items-center sm:gap-6 sm:border-0 sm:pt-0 sm:text-sm"
        >
          <Link href="/mint" className="py-1 transition-colors hover:text-[#7AF0BA]">
            Mint
          </Link>
          <Link href="/train" className="py-1 transition-colors hover:text-[#7AF0BA]">
            Train
          </Link>
          <Link href="/arena" className="py-1 transition-colors hover:text-[#7AF0BA]">
            Arena
          </Link>
          <Link href="/leaderboard" className="py-1 transition-colors hover:text-[#7AF0BA]">
            Leaderboard
          </Link>
        </nav>
        <div className="hidden sm:block">
          <ConnectButton
            accountStatus="address"
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </div>
    </header>
  );
}
