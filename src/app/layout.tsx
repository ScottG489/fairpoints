import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PAGE_PAPER_STYLE, TOKENS } from "@/lib/brand";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "fair points — a notebook for talking",
  description:
    "Pick a topic, share where you stand, and get matched with one person who sees it differently. The goal is to understand them, not to win.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        geist.variable,
        newsreader.variable,
      )}
    >
      <body className="bg-background text-foreground min-h-full flex flex-col font-sans">
        <Providers>
          <div
            className="relative flex min-h-screen flex-1 flex-col"
            style={{
              ...PAGE_PAPER_STYLE,
              color: TOKENS.ink,
              fontFamily: "var(--font-newsreader)",
            }}
          >
            <Vignette />
            <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-9 px-6 py-9 md:gap-12">
              <SiteHeader />
              <main className="flex flex-1 flex-col">{children}</main>
              <SiteFooter />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

function Vignette() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        background:
          "radial-gradient(120% 100% at 50% 0%, transparent 50%, rgba(76,52,18,0.06) 80%, rgba(76,52,18,0.12) 100%)",
      }}
    />
  );
}
