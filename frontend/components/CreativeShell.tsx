import { ReactNode } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { grainTexture } from "@/lib/design";

type CreativeShellProps = {
  children: ReactNode;
};

// Wraps the page body with the global "Living Creature" stage:
// fixed grain + glow background, a slim sticky header, and a
// typographic footer. The content region is the only place where
// pages emit their own region structure.
export function CreativeShell({ children }: CreativeShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-[#F5F6FA]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: grainTexture, backgroundColor: "#0A0C13" }}
      />
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#1F2333] bg-[#0A0C13]/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="MonadMon home">
          <span className="text-2xl leading-none">🥚</span>
          <span className="text-lg font-bold tracking-tight text-[#7AF0BA]">
            MonadMon
          </span>
        </Link>
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 text-sm text-[#B5BAC8] sm:flex"
        >
          <Link href="/mint" className="transition-colors hover:text-[#7AF0BA]">
            Mint
          </Link>
          <Link href="/train" className="transition-colors hover:text-[#7AF0BA]">
            Train
          </Link>
          <Link href="/arena" className="transition-colors hover:text-[#7AF0BA]">
            Arena
          </Link>
          <Link
            href="/leaderboard"
            className="transition-colors hover:text-[#7AF0BA]"
          >
            League
          </Link>
        </nav>
        <span data-rk-account-button>
          <ConnectButton
            accountStatus="address"
            chainStatus="icon"
            showBalance={false}
          />
        </span>
      </div>
      <nav
        aria-label="Primary mobile"
        className="grid grid-cols-4 border-t border-[#1F2333] text-center text-xs text-[#B5BAC8] sm:hidden"
      >
        <Link href="/mint" className="py-2 transition-colors hover:text-[#7AF0BA]">
          Mint
        </Link>
        <Link href="/train" className="py-2 transition-colors hover:text-[#7AF0BA]">
          Train
        </Link>
        <Link href="/arena" className="py-2 transition-colors hover:text-[#7AF0BA]">
          Arena
        </Link>
        <Link
          href="/leaderboard"
          className="py-2 transition-colors hover:text-[#7AF0BA]"
        >
          League
        </Link>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-32 border-t border-[#1F2333] py-10 text-xs text-[#858DA1]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6">
        <p className="font-mono uppercase tracking-[0.2em]">
          MonadMon · Testnet build · 2026
        </p>
        <p className="text-[#858DA1]">
          The first living creatures on{" "}
          <span className="text-[#7AF0BA]">Monad</span>.
        </p>
      </div>
    </footer>
  );
}
