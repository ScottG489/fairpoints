import Link from "next/link";
import { MessageCircleMore } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <MessageCircleMore className="text-primary size-5" />
          <span>Debatable</span>
        </Link>
        <nav className="text-muted-foreground flex items-center gap-5 text-sm">
          <Link href="/" className="hover:text-foreground transition-colors">
            Start a debate
          </Link>
          <a
            href="https://github.com/ScottG489/debatable"
            className="hover:text-foreground transition-colors"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
