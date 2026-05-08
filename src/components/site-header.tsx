import Link from "next/link";

import { DOUBLE_RULE, TAGLINE_LONG, TOKENS } from "@/lib/brand";

export function SiteHeader() {
  return (
    <header
      className="pb-3"
      style={{ borderBottom: DOUBLE_RULE }}
    >
      <div className="flex items-baseline justify-between">
        <Link
          href="/"
          className="flex items-baseline gap-1.5 text-lg"
          style={{ fontWeight: 500, letterSpacing: "-0.005em" }}
        >
          <span>fair points</span>
          <span
            style={{
              color: TOKENS.inkMuted,
              fontStyle: "italic",
              fontSize: "0.85em",
            }}
          >
            — {TAGLINE_LONG}
          </span>
        </Link>
        <nav
          className="flex items-baseline gap-5 text-sm"
          style={{ color: TOKENS.inkMuted }}
        >
          <Link
            href="/#how"
            className="transition-colors hover:text-[color:var(--foreground)]"
          >
            how it goes
          </Link>
          <a
            href="https://github.com/ScottG489/debatable"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-[color:var(--foreground)]"
          >
            github
          </a>
        </nav>
      </div>
    </header>
  );
}
