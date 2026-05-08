import { TOKENS } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer
      className="flex flex-wrap items-baseline justify-between gap-2 pt-2 text-sm"
      style={{ color: TOKENS.inkMuted }}
    >
      <p style={{ fontStyle: "italic" }}>
        fair points — a notebook for hearing someone out.
      </p>
      <p
        className="text-xs uppercase tracking-[0.22em]"
        style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}
      >
        v0.2
      </p>
    </footer>
  );
}
