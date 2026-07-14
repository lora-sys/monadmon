import { ReactNode } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { accentMesh, noiseFilter } from "@/lib/design";

type CreativeShellProps = {
  children: ReactNode;
};

export function CreativeShell({ children }: CreativeShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#04060B] text-[#F5F6FA]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-30"
        style={{ background: accentMesh.dim, backgroundColor: "#04060B" }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: `url("${noiseFilter}")`,
          backgroundSize: "256px 256px",
        }}
      />
      <Header />
      <main className="relative w-full">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#1F2333] bg-[#04060B]/70 backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 items-center gap-6 px-6 py-4 sm:px-10">
        <Link
          href="/"
          className="col-span-6 flex items-center gap-3 sm:col-span-3"
          aria-label="MonadMon home"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#7AF0BA]">
            MM
          </span>
          <span className="text-lg font-bold tracking-tight">MonadMon</span>
        </Link>
        <nav
          aria-label="Primary"
          className="col-span-12 hidden items-center gap-8 text-xs uppercase tracking-[0.3em] text-[#B5BAC8] sm:col-span-6 sm:flex"
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
          <Link href="/leaderboard" className="transition-colors hover:text-[#7AF0BA]">
            League
          </Link>
        </nav>
        <div className="col-span-6 ml-auto flex items-center justify-end sm:col-span-3">
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
          className="col-span-12 grid grid-cols-4 border-t border-[#1F2333] text-center text-[10px] uppercase tracking-[0.3em] text-[#B5BAC8] sm:hidden"
        >
          <Link href="/mint" className="py-3 transition-colors hover:text-[#7AF0BA]">
            Mint
          </Link>
          <Link href="/train" className="py-3 transition-colors hover:text-[#7AF0BA]">
            Train
          </Link>
          <Link href="/arena" className="py-3 transition-colors hover:text-[#7AF0BA]">
            Arena
          </Link>
          <Link
            href="/leaderboard"
            className="py-3 transition-colors hover:text-[#7AF0BA]"
          >
            League
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative mt-48 border-t border-[#1F2333] py-16 text-xs text-[#5B6378]">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 gap-6 px-6 sm:px-10">
        <p className="col-span-6 font-mono uppercase tracking-[0.3em]">
          MonadMon · Testnet build · 2026
        </p>
        <p className="col-span-6 text-right text-[#858DA1]">
          The first living creatures on{" "}
          <span className="text-[#7AF0BA]">Monad</span>.
        </p>
      </div>
    </footer>
  );
}
