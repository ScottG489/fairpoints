import { TopicCard } from "@/components/topic-card";
import {
  DOUBLE_RULE,
  PASTELS,
  PRINCIPLES,
  TOKENS,
} from "@/lib/brand";
import { availableTopics } from "@/lib/topics";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-9 md:gap-12">
      <Body />
      <HouseRules />
    </div>
  );
}

function Body() {
  return (
    <section className="grid gap-8 md:grid-cols-3">
      <Lede />
      <div className="grid gap-6 md:col-span-2 md:grid-cols-2">
        {availableTopics.map((topic, i) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            pastel={PASTELS[i % PASTELS.length]}
          />
        ))}
      </div>
    </section>
  );
}

function Lede() {
  return (
    <article
      className="flex flex-col gap-4 md:border-r md:pr-6"
      style={{ borderColor: TOKENS.rule }}
    >
      <span
        className="text-[10px] uppercase tracking-[0.28em]"
        style={{
          color: TOKENS.accent,
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
        }}
      >
        About this place
      </span>
      <h2
        className="text-3xl"
        style={{
          fontFamily: "var(--font-newsreader)",
          fontWeight: 500,
          letterSpacing: "-0.015em",
          lineHeight: 1.15,
        }}
      >
        Pick a topic. Hear someone out.
      </h2>
      <p className="text-base leading-relaxed">
        <span
          className="float-left mr-2 mt-1 text-5xl leading-[0.85]"
          style={{
            color: TOKENS.accent,
            fontFamily: "var(--font-newsreader)",
            fontWeight: 500,
          }}
        >
          P
        </span>
        ick a stance on the topic of your choice and we&rsquo;ll match you with one
        person who lands somewhere else. Anonymous, one-on-one. The goal isn&rsquo;t
        to win, it&rsquo;s to leave the conversation with one thing you didn&rsquo;t
        have when you arrived.
      </p>
      <p
        className="text-sm leading-relaxed"
        style={{ color: TOKENS.inkMuted, fontStyle: "italic" }}
      >
        Most disagreement is misunderstanding waiting for a translator.
      </p>
    </article>
  );
}

function HouseRules() {
  return (
    <section
      id="how"
      className="flex flex-col gap-5 py-7"
      style={{ borderTop: DOUBLE_RULE, borderBottom: DOUBLE_RULE }}
    >
      <h2
        className="text-xs uppercase tracking-[0.32em]"
        style={{
          color: TOKENS.inkMuted,
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
        }}
      >
        House rules
      </h2>
      <ol className="grid gap-x-8 gap-y-3 md:grid-cols-2">
        {PRINCIPLES.map((line, i) => (
          <li
            key={line}
            className="flex items-baseline gap-3 text-base leading-relaxed"
          >
            <span
              className="shrink-0 tabular-nums"
              style={{
                color: TOKENS.accent,
                fontStyle: "italic",
                minWidth: "1.6rem",
              }}
            >
              {String(i + 1).padStart(2, "0")}.
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
