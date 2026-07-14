import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-24 -mt-4">
      {/* ===================== HERO (Poster 1) ===================== */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8">
        <div className="relative w-full overflow-hidden">
          <Image
            src="/assets/marketing/poster-hero.png"
            alt="MonadMon — The first living creatures on Monad"
            width={1122}
            height={1402}
            priority
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* ===================== TAGLINE ===================== */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          The first living creatures on{" "}
          <span className="bg-gradient-to-r from-[#7AF0BA] to-[#C9A7FF] bg-clip-text text-transparent">
            Monad
          </span>
        </h1>
        <p className="text-lg text-[#B5BAC8]">
          Connect your wallet. Mint a Genesis Egg. Hatch a Monster that is
          truly yours — born on-chain, mine forever.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/mint"
            className="px-8 py-4 bg-gradient-to-r from-[#7AF0BA] to-[#5cd891] text-[#0B0D14] font-bold rounded-md hover:scale-105 transition-transform shadow-lg shadow-[#7AF0BA]/20"
          >
            Mint my Genesis Egg
          </Link>
          <Link
            href="/leaderboard"
            className="px-8 py-4 border border-[#232839] hover:border-[#7AF0BA] rounded-md transition-colors"
          >
            View Leaderboard
          </Link>
        </div>
      </section>

      {/* ===================== ARENA (Poster 2) ===================== */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8">
        <Image
          src="/assets/marketing/poster-arena.png"
          alt="MonadMon Arena — Onchain monster battles on Monad"
          width={1122}
          height={1402}
          className="w-full h-auto"
        />
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="max-w-5xl mx-auto space-y-10">
        <header className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
          <p className="text-[#B5BAC8]">Three steps. Five minutes. Yours forever.</p>
        </header>
        <div className="grid md:grid-cols-3 gap-6">
          <Step
            n={1}
            title="Mint"
            desc="One Genesis Egg per wallet. Free on testnet."
            href="/mint"
            cta="Mint an Egg"
          />
          <Step
            n={2}
            title="Hatch"
            desc="A species + DNA + stats are derived on-chain from Monad's randomness. Truly unique."
            href="/train"
            cta="Train your Monster"
          />
          <Step
            n={3}
            title="Battle"
            desc="Challenge other players. Type chart, level curve, real stakes."
            href="/arena"
            cta="Enter the Arena"
          />
        </div>
      </section>

      {/* ===================== TEAM (Poster 3) ===================== */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8">
        <Image
          src="/assets/marketing/poster-team.png"
          alt="MonadMon — Build your team"
          width={1122}
          height={1402}
          className="w-full h-auto"
        />
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="text-center space-y-6 pb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Your first Monad creature awaits.</h2>
        <Link
          href="/mint"
          className="inline-block px-10 py-5 bg-gradient-to-r from-[#7AF0BA] to-[#C9A7FF] text-[#0B0D14] font-bold rounded-md hover:scale-105 transition-transform shadow-lg shadow-[#7AF0BA]/30"
        >
          Mint your Genesis Egg
        </Link>
        <p className="text-xs text-[#858DA1]">
          One per wallet · On Monad testnet · Forever yours
        </p>
      </section>
    </div>
  );
}

function Step({
  n,
  title,
  desc,
  href,
  cta,
}: {
  n: number;
  title: string;
  desc: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="bg-[#11141D] border border-[#232839] rounded-lg p-6 hover:border-[#7AF0BA] transition-colors group">
      <div className="text-[#7AF0BA] text-sm font-mono mb-3">STEP {n}</div>
      <div className="text-2xl font-bold mb-2">{title}</div>
      <div className="text-[#B5BAC8] text-sm mb-4">{desc}</div>
      <Link
        href={href}
        className="text-sm font-semibold text-[#7AF0BA] group-hover:underline"
      >
        {cta} →
      </Link>
    </div>
  );
}
