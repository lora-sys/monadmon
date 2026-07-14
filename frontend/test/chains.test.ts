import { afterEach, describe, expect, it, vi } from "vitest";

describe("active chain RPC configuration", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_MONAD_RPC_URL;
    vi.resetModules();
  });

  it("uses a configured local RPC port", async () => {
    process.env.NEXT_PUBLIC_MONAD_RPC_URL = "http://127.0.0.1:9545";
    const { activeChain } = await import("../lib/chains");
    expect(activeChain.id).toBe(31_337);
    expect(activeChain.rpcUrls.default.http).toEqual(["http://127.0.0.1:9545"]);
  });

  it("defaults to Monad testnet", async () => {
    const { activeChain } = await import("../lib/chains");
    expect(activeChain.id).toBe(10_143);
    expect(activeChain.rpcUrls.default.http).toEqual([
      "https://testnet-rpc.monad.xyz",
    ]);
  });
});
