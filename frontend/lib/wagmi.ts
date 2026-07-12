import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { monadTestnet } from "./chains";

export const wagmiConfig = getDefaultConfig({
  appName: "MonadMon",
  projectId: "monadmon-monad-testnet",
  chains: [monadTestnet],
});
