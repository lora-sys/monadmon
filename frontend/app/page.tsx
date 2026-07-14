import Image from "next/image";
import Link from "next/link";
import { species } from "@/lib/species";

export default function HomePage() {
  return (
    <div className="space-y-32 pb-24">
      <Hero />
      <SpeciesMarquee />
      <AwakeningSteps />
      <ArenaBanner />
      <LeaguePreview />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative grid min-h-[88vh] grid-cols-1 items-end gap-12 pt-12 lg:grid-cols-12">
      <div className="lg:col-span-7 lg:pt-24">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#7AF0BA]">
          Mythmaking / Block 1
        </p>
        <h1
          className="mt-6 text-[clamp(3.5rem,9vw,8rem)] font-bold leading-[0.92] tracking-tight"
        >
          Living
          <br />
          creatures
          <br />
          <span className="text-[#7AF0BA]">on&nbsp;Monad.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-[#B5BAC8] sm:text-lg">
          Connect your wallet. Mint a Genesis Egg. Hatch a Monster that
          is truly yours — born on-chain, mine forever, ready to duel.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/mint"
            className="inline-flex items-center gap-3 rounded-full bg-[#7AF0BA] px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#0A0C13] transition-transform hover:scale-[1.04]"
          >
            <span>Mint your egg</span>
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 rounded-full border border-[#1F2333] px-6 py-3 text-sm uppercase tracking-[0.18em] text-[#B5BAC8] transition-colors hover:border-[#7AF0BA] hover:text-[#7AF0BA]"
          >
            Explore the league
          </Link>
        </div>
      </div>
      <div className="relative lg:col-span-5">
        <div
          aria-hidden
          className="absolute -inset-12 -z-10 rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(122,240,186,0.45), transparent 65%)",
          }}
        />
        <div
          className="relative mx-auto aspect-square w-[78%] max-w-[440px]"
          style={{ animation: "mm-float 4s ease-in-out infinite" }}
        >
          <Image
            src="/assets/marketing/poster-hero.png"
            alt="A featured MonadMon creature"
            width={1122}
            height={1402}
            priority
            className="h-full w-full object-cover"
          />
        </div>
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-[#858DA1]">
          Token · 0000 / 12,000 · Genesis
        </p>
      </div>
    </section>
  );
}

function SpeciesMarquee() {
  const tiles = [...species, ...species];
  return (
    <section className="relative overflow-hidden border-y border-[#1F2333] py-10">
      <div
        className="flex w-max gap-6"
        style={{ animation: "mm-marquee 32s linear infinite" }}
      >
        {tiles.map((s, idx) => (
          <article
            key={`${s.id}-${idx}`}
            className="flex w-44 shrink-0 flex-col items-center gap-3 rounded-2xl border border-[#1F2333] bg-[#0E1119] p-3"
          >
            <Image
              src={`/assets/monsters/${s.id}/stage1.png`}
              alt={s.name}
              width={256}
              height={256}
              unoptimized
              className="h-28 w-28 object-contain"
            />
            <div className="text-center">
              <p className="text-sm font-semibold">{s.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#858DA1]">
                {s.element}
              </p>
            </div>
          </article>
        ))}
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
      body: "One per wallet. The egg lives at your address and the hatch stays forever yours.",
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
    <section className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <header className="lg:col-span-4">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#7AF0BA]">
          Field notes
        </p>
        <h2 className="mt-3 text-[clamp(2rem,4vw,3.25rem)] font-bold leading-tight">
          How a creature awakens.
        </h2>
        <p className="mt-4 max-w-sm text-sm text-[#858DA1]">
          Five steps. Five minutes. Yours forever.
        </p>
      </header>
      <ol className="lg:col-span-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {steps.map((step) => (
          <li
            key={step.n}
            className="rounded-2xl border border-[#1F2333] bg-[#0E1119] p-5"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#7AF0BA]">
              Step {step.n}
            </p>
            <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-[#B5BAC8]">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ArenaBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#1F2333]">
      <Image
        src="/assets/marketing/poster-arena.png"
        alt="MonadMon arena"
        width={1122}
        height={1402}
        className="h-auto w-full"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0C13] via-transparent to-transparent" />
      <div className="pointer-events-none absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#7AF0BA]">
          The arena
        </p>
        <p className="mt-2 max-w-md text-sm text-[#B5BAC8] sm:text-base">
          Wins climb the league. Losers return stronger. Every fight is
          a story minted to your wallet.
        </p>
      </div>
    </section>
  );
}

function LeaguePreview() {
  return (
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <header className="lg:col-span-5">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#7AF0BA]">
          The league
        </p>
        <h2 className="mt-3 text-[clamp(2rem,4vw,3.25rem)] font-bold leading-tight">
          The strongest trainers.
        </h2>
        <p className="mt-4 max-w-sm text-sm text-[#858DA1]">
          Live standings ranked by verified wins. The indexer reads each
          battle the moment it resolves.
        </p>
        <Link
          href="/leaderboard"
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#7AF0BA] px-5 py-2 text-sm text-[#7AF0BA] hover:bg-[#7AF0BA] hover:text-[#0A0C13]"
        >
          See the full league →
        </Link>
      </header>
      <div className="lg:col-span-7 rounded-3xl border border-[#1F2333] bg-[#0E1119] p-6">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[#858DA1]">
          Preview · top trainer
        </p>
        <p className="mt-3 text-2xl font-bold">0xf39f…b92266</p>
        <p className="font-mono text-sm text-[#B5BAC8]">1 win · 80 XP</p>
        <p className="mt-4 text-xs text-[#858DA1]">
          The leaderboard is powered by{" "}
          <code className="rounded bg-[#141826] px-1 py-0.5 text-[#7AF0BA]">
            /api/leaderboard
          </code>
          .
        </p>
      </div>
    </section>
  );
}
