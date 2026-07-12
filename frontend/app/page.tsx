import Link from "next/link";
import { species } from "@/lib/species";

export default function HomePage() {
  const featured = species.slice(0, 6);

  return (
    <div className="space-y-16">
      <section className="text-center py-12 space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          The first living creatures on{" "}
          <span className="text-[#7AF0BA]">Monad</span>
        </h1>
        <p className="text-lg text-[#B5BAC8] max-w-2xl mx-auto">
          Connect your wallet. Mint a Genesis Egg. Hatch a Monster that is
          truly yours — born on-chain, mine forever.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/mint"
            className="px-6 py-3 bg-[#7AF0BA] text-[#0B0D14] font-semibold rounded-md hover:bg-[#5cd891] transition-colors"
          >
            Mint my Genesis Egg
          </Link>
          <Link
            href="/leaderboard"
            className="px-6 py-3 border border-[#232839] hover:border-[#7AF0BA] rounded-md transition-colors"
          >
            View Leaderboard
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Twelve species. One Monad. Yours.</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {featured.map((s) => (
            <div
              key={s.id}
              className="bg-[#11141D] border border-[#232839] rounded-md p-3 text-center hover:border-[#7AF0BA] transition-colors"
            >
              <div className="aspect-square bg-[#1A1E2A] rounded mb-2 flex items-center justify-center text-4xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.stages[1].art} alt={s.name} className="w-full h-full object-cover rounded" />
              </div>
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="text-xs text-[#6E7589]">{s.element}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-[#6E7589]">
          + 6 more species waiting in the wild.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <Step
          n={1}
          title="Mint"
          desc="One Genesis Egg per wallet. Free on testnet."
        />
        <Step
          n={2}
          title="Hatch"
          desc="A species + DNA + stats are derived on-chain from Monad's randomness. Truly unique."
        />
        <Step
          n={3}
          title="Battle"
          desc="Challenge other players. Type chart, level curve, real stakes."
        />
      </section>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="bg-[#11141D] border border-[#232839] rounded-md p-6">
      <div className="text-[#7AF0BA] text-sm font-mono mb-2">STEP {n}</div>
      <div className="text-xl font-semibold mb-2">{title}</div>
      <div className="text-[#B5BAC8] text-sm">{desc}</div>
    </div>
  );
}
