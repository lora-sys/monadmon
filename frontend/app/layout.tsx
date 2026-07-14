import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { CreativeShell } from "@/components/CreativeShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "MonadMon — The first living creatures on Monad",
  description:
    "An on-chain creature-raising and PvP battle game on Monad. Connect your wallet, mint a Genesis Egg, hatch a Monster, and battle other players.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <CreativeShell>{children}</CreativeShell>
        </Providers>
      </body>
    </html>
  );
}
