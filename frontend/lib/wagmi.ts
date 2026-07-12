import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { activeChain } from "./chains";

export const wagmiConfig = getDefaultConfig({
  appName: "MonadMon",
  projectId: "monadmon-monad-testnet",
  chains: [activeChain],
});
