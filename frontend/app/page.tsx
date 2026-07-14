"use client";

import Image from "next/image";
import Link from "next/link";
import { ParticleField } from "@/components/ParticleField";
import { SectionLabel } from "@/components/SectionLabel";
import { species } from "@/lib/species";
import { accentMesh, typeScale } from "@/lib/design";

export default function HomePage() {
  return (
    <div className="space-y-40 pb-24">
      <Hero />
      <SpeciesCodex />
      <AwakeningSteps />
      <ArenaWall />
      <LeagueStrip />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate grid min-h-[100svh] grid-cols-12 gap-6 overflow-hidden px-6 pt-24 sm:px-10 lg:pt-32">
      <ParticleField height="100%" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: accentMesh.hero }}
      />
      <div className="col-span-12 lg:col-span-8 flex flex-col justify-end pb-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#7AF0BA]">
          — Aurelia / Issue 001
        </p>
        <h1
          className="mt-10 font-bold leading-[0.85] tracking-[-0.04em] text-[#F5F6FA]"
          style={{ fontSize: typeScale.display }}
        >
          Living
          <br />
          creatures
          <br />
          <span className="italic text-[#7AF0BA]">on&nbsp;Monad.</span>
        </h1>
        <p className="mt-10 max-w-xl text-base text-[#B5BAC8] sm:text-lg">
          Connect your wallet. Mint a Genesis Egg. Hatch a Monster that
          is truly yours — born on-chain, mine forever, ready to duel.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-6">
          <Link
            href="/mint"
            className="inline-flex items-center gap-3 border border-[#7AF0BA] bg-[#7AF0BA]/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#7AF0BA] transition-colors hover:bg-[#7AF0BA] hover:text-[#04060B]"
          >
            <span>Mint your egg</span>
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-3 border border-[#1F2333] px-8 py-4 text-sm uppercase tracking-[0.3em] text-[#B5BAC8] transition-colors hover:border-[#7AF0BA] hover:text-[#7AF0BA]"
          >
            Explore the league
          </Link>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4 relative flex flex-col items-end justify-end">
        <div className="relative aspect-[3/4] w-full max-w-[420px]">
          <div
            className="absolute -inset-10 -z-10"
            style={{
              background:
                "radial-gradient(circle at 50% 60%, rgba(122,240,186,0.45), transparent 60%)",
            }}
          />
          <Image
            src="/assets/marketing/poster-hero.png"
            alt="A featured MonadMon creature"
            width={1122}
            height={1402}
            priority
            className="h-full w-full object-cover"
          />
          <p className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.4em] text-[#5B6378]">
            Token · 0000 / 12,000 · Genesis
          </p>
        </div>
      </div>
    </section>
  );
}

function SpeciesCodex() {
  const tiles = [...species, ...species, ...species];
  return (
    <section className="relative overflow-hidden border-y border-[#1F2333] py-24">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-12 gap-6 px-6 sm:px-10">
        <div className="col-span-12 lg:col-span-3">
          <SectionLabel index="02">Species codex</SectionLabel>
          <h2 className="mt-6 font-bold leading-[0.85] tracking-[-0.04em]" style={{ fontSize: typeScale.displayMd }}>
            Twelve.
            <br />
            One Monad.
          </h2>
          <p className="mt-4 max-w-xs text-sm text-[#858DA1]">
            The hatch reveals one of twelve species, each with a unique
            element, role, and rarity. Every DNA is final.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-9 overflow-hidden">
          <div
            className="flex w-max gap-3"
            style={{ animation: "mm-marquee 40s linear infinite" }}
          >
            {tiles.map((s, idx) => (
              <article
                key={`${s.id}-${idx}`}
                className="group flex w-44 shrink-0 flex-col gap-4 border border-[#1F2333] bg-[#04060B] p-4"
              >
                <Image
                  src={`/assets/monsters/${s.id}/stage1.png`}
                  alt={s.name}
                  width={256}
                  height={256}
                  unoptimized
                  className="h-32 w-32 self-center object-contain transition-transform group-hover:scale-110"
                />
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#858DA1]">
                    {s.element} · {s.rarity}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AwakeningSteps() {
  const steps = [
    {
      n: "01",
      title: "Connect your wallet",
      body: "RainbowKit meets Monad in a single click. Switch to testnet, sign once, you're a breeder.",
    },
    {
      n: "02",
      title: "Mint your Genesis Egg",
      body: "One per wallet, forever. The egg lives at your address and the hatch stays yours.",
    },
    {
      n: "03",
      title: "Hatch the egg",
      body: "On-chain entropy reveals a species and 64-bit DNA. There are twelve possibilities, no rerolls.",
    },
    {
      n: "04",
      title: "Train the creature",
      body: "Earn XP and ATK, level up, mutate your DNA. Six hours between sessions, real time.",
    },
    {
      n: "05",
      title: "Duel another trainer",
      body: "The arena resolves deterministically. Wins climb the league. Losers come back stronger.",
    },
  ];
  return (
    <section className="relative mx-auto w-full max-w-[1400px] px-6 sm:px-10">
      <div className="grid grid-cols-12 gap-6">
        <header className="col-span-12 lg:col-span-4">
          <SectionLabel index="03">Field notes</SectionLabel>
          <h2
            className="mt-6 font-bold leading-[0.9] tracking-[-0.04em]"
            style={{ fontSize: typeScale.displayMd }}
          >
            How a creature awakens.
          </h2>
          <p className="mt-4 max-w-xs text-sm text-[#858DA1]">
            Five steps. Five minutes. Yours forever.
          </p>
        </header>
        <ol className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {steps.map((step, idx) => (
            <li
              key={step.n}
              className="group relative flex flex-col gap-3 border border-[#1F2333] bg-[#04060B] p-5 transition-colors hover:border-[#7AF0BA]"
              style={{
                gridColumn: idx === 0 ? "span 2" : undefined,
              }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#5B6378]">
                Step {step.n}
              </p>
              <p className="text-lg font-semibold leading-tight">{step.title}</p>
              <p className="text-sm text-[#B5BAC8]">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ArenaWall() {
  return (
    <section className="relative overflow-hidden border-y border-[#1F2333]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(4,6,11,0.4) 0%, rgba(4,6,11,0) 30%, rgba(4,6,11,0) 70%, rgba(4,6,11,0.4) 100%)",
        }}
      />
      <Image
        src="/assets/marketing/poster-arena.png"
        alt="MonadMon arena"
        width={1122}
        height={1402}
        className="h-auto w-full"
      />
      <div className="pointer-events-none absolute inset-0 grid place-items-end">
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-16 sm:px-10">
          <div className="max-w-md">
            <SectionLabel index="04">The arena</SectionLabel>
            <p className="mt-4 text-sm text-[#F5F6FA] sm:text-base">
              Wins climb the league. Losers return stronger. Every fight
              is a story minted to your wallet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function LeagueStrip() {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 sm:px-10">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-5">
          <SectionLabel index="05">The league</SectionLabel>
          <h2
            className="mt-6 font-bold leading-[0.9] tracking-[-0.04em]"
            style={{ fontSize: typeScale.displayMd }}
          >
            The strongest trainers.
          </h2>
          <p className="mt-4 max-w-xs text-sm text-[#858DA1]">
            Live standings ranked by verified wins. Updated every 15
            seconds as the indexer materializes each battle.
          </p>
          <Link
            href="/leaderboard"
            className="mt-8 inline-flex items-center gap-3 border border-[#7AF0BA] px-6 py-3 text-sm uppercase tracking-[0.3em] text-[#7AF0BA] transition-colors hover:bg-[#7AF0BA] hover:text-[#04060B]"
          >
            See the full league →
          </Link>
        </div>
        <div className="col-span-12 lg:col-span-7 border border-[#1F2333] bg-[#04060B] p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#5B6378]">
            Preview · top trainer
          </p>
          <p className="mt-6 font-bold leading-[0.9] tracking-[-0.04em]" style={{ fontSize: typeScale.displayMd }}>
            0xf39f…b92266
          </p>
          <p className="mt-2 font-mono text-sm text-[#B5BAC8]">1 win · 80 XP</p>
          <p className="mt-6 text-xs text-[#858DA1]">
            Live via{" "}
            <code className="border border-[#1F2333] bg-[#10131C] px-2 py-1 text-[#7AF0BA]">
              GET /api/leaderboard
            </code>
          </p>
        </div>
      </div>
    </section>
  );
}
