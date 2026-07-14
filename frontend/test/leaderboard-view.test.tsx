import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LeaderboardView } from "../components/LeaderboardView";

const ENTRY = {
  address: "0x2000000000000000000000000000000000000002" as const,
  wins: 2,
  total_xp: 75,
  rank: 1,
};

describe("LeaderboardView", () => {
  it("renders a loading state", () => {
    expect(markup({ isLoading: true, isError: false })).toContain("Loading rankings");
  });

  it("renders an unavailable state", () => {
    expect(markup({ isLoading: false, isError: true })).toContain("Leaderboard unavailable");
  });

  it("renders an empty state", () => {
    expect(markup({ entries: [], isLoading: false, isError: false })).toContain(
      "No ranked trainers yet",
    );
  });

  it("renders live rows without demo trainers", () => {
    const html = markup({ entries: [ENTRY], isLoading: false, isError: false });
    expect(html).toContain("0x200000...000002");
    expect(html).toContain(">2<");
    expect(html).toContain(">75<");
    expect(html).not.toContain("DragonMaster");
  });
});

function markup(props: Parameters<typeof LeaderboardView>[0]): string {
  return renderToStaticMarkup(<LeaderboardView {...props} />);
}
