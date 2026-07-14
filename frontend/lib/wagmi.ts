import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { activeChain } from "./chains";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = getDefaultConfig({
  appName: "MonadMon",
  projectId: walletConnectProjectId ?? "local-injected-only",
  chains: [activeChain],
  wallets: walletConnectProjectId
    ? undefined
    : [{ groupName: "Browser Wallet", wallets: [injectedWallet] }],
});
