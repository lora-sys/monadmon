import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "MonadMon — The first living creatures on Monad",
  description:
    "An on-chain creature-raising and PvP battle game on Monad. Connect your wallet, mint a Genesis Egg, hatch a Monster, and battle other players.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0B0D14] text-[#F5F6FA] antialiased min-h-screen">
        <Providers>
          <Header />
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
          <footer className="border-t border-[#232839] mt-16 py-6 text-center text-sm text-[#6E7589]">
            MonadMon · Testnet build · 2026
          </footer>
        </Providers>
      </body>
    </html>
  );
}
