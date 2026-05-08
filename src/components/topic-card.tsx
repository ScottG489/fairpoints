import Link from "next/link";

import { CARD_GRAIN_URL, type Pastel, TOKENS } from "@/lib/brand";
import type { Topic } from "@/lib/types";

interface Props {
  topic: Topic;
  pastel: Pastel;
  size?: "sm" | "md" | "lg";
  cta?: string;
}

export function TopicCard({
  topic,
  pastel,
  size = "md",
  cta = "Hear someone out",
}: Props) {
  const titleSize =
    size === "lg" ? "text-3xl md:text-4xl" : size === "sm" ? "text-lg" : "text-2xl";
  const padY = size === "lg" ? "py-7" : size === "sm" ? "py-4" : "py-5";

  return (
    <Link
      href={`/viewpoint?topic=${encodeURIComponent(topic.id)}`}
      className="group block h-full overflow-hidden rounded-xl transition-all hover:-translate-y-0.5"
      style={{
        backgroundColor: TOKENS.card,
        backgroundImage: CARD_GRAIN_URL,
        backgroundSize: "200px 200px",
        boxShadow:
          "0 1px 0 rgba(44,36,24,0.04), 0 12px 28px -16px rgba(76,52,18,0.30)",
        border: "1px solid rgba(44,36,24,0.08)",
      }}
    >
      <div
        className="flex items-center gap-2 px-5 py-2.5"
        style={{
          backgroundColor: pastel.bg,
          borderBottom: "1px solid rgba(44,36,24,0.08)",
        }}
      >
        <span
          className="text-[10px] uppercase tracking-[0.22em]"
          style={{
            color: pastel.ink,
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
          }}
        >
          {pastel.name}
        </span>
      </div>
      <div className={`flex flex-col gap-2 px-5 ${padY}`}>
        <h3
          className={titleSize}
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 500,
            letterSpacing: "-0.012em",
            lineHeight: 1.18,
          }}
        >
          {topic.name}
        </h3>
        {topic.blurb ? (
          <p
            className="text-sm leading-relaxed"
            style={{
              color: TOKENS.inkMuted,
              fontFamily: "var(--font-newsreader)",
            }}
          >
            {topic.blurb}
          </p>
        ) : null}
        <span
          className="mt-1 inline-flex items-baseline gap-1.5 text-sm transition-transform group-hover:translate-x-0.5"
          style={{
            color: TOKENS.accent,
            fontFamily: "var(--font-newsreader)",
            fontStyle: "italic",
          }}
        >
          {cta} →
        </span>
      </div>
    </Link>
  );
}
