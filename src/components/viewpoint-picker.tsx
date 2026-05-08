"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CARD_GRAIN_URL, PASTELS, type Pastel, TOKENS } from "@/lib/brand";
import { availableViewpoints, findTopic } from "@/lib/topics";
import type { ViewpointId } from "@/lib/types";

const stancePastel: Record<ViewpointId, Pastel> = {
  agree: PASTELS[1], // sage
  disagree: PASTELS[0], // rose
};

export function ViewpointPicker() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic");
  const topic = findTopic(topicId);

  if (!topic) {
    return <NoTopicState />;
  }

  return (
    <div className="flex flex-col gap-9">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 text-sm transition-colors hover:text-[color:var(--foreground)]"
        style={{ color: TOKENS.inkMuted }}
      >
        <ArrowLeft className="size-3.5" />
        Change topic
      </Link>

      <header className="flex flex-col gap-3">
        <span
          className="text-[10px] uppercase tracking-[0.28em]"
          style={{
            color: TOKENS.accent,
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
          }}
        >
          About this topic
        </span>
        <h1
          className="text-balance text-3xl md:text-4xl"
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 500,
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
          }}
        >
          {topic.name}
        </h1>
        {topic.blurb ? (
          <p
            className="text-base leading-relaxed"
            style={{ color: TOKENS.ink }}
          >
            {topic.blurb}
          </p>
        ) : null}
        <p
          className="text-base leading-relaxed"
          style={{ color: TOKENS.inkMuted, fontStyle: "italic" }}
        >
          Where do you stand? You&rsquo;ll be matched with one person who lands
          somewhere else.
        </p>
      </header>

      <ul className="grid gap-4 md:grid-cols-2">
        {availableViewpoints.map((vp) => (
          <li key={vp.id}>
            <StanceCard
              topicId={topic.id}
              viewpoint={vp}
              pastel={stancePastel[vp.id]}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function StanceCard({
  topicId,
  viewpoint,
  pastel,
}: {
  topicId: string;
  viewpoint: { id: ViewpointId; name: string; description: string };
  pastel: Pastel;
}) {
  const href = `/chat?topic=${encodeURIComponent(topicId)}&viewpoint=${encodeURIComponent(viewpoint.id)}`;
  return (
    <Link
      href={href}
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
      <div className="flex flex-col gap-2 px-5 py-5">
        <h3
          className="text-2xl"
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 500,
            letterSpacing: "-0.012em",
            lineHeight: 1.18,
          }}
        >
          {viewpoint.name}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{
            color: TOKENS.inkMuted,
            fontFamily: "var(--font-newsreader)",
          }}
        >
          {viewpoint.description}
        </p>
        <span
          className="mt-1 inline-flex items-baseline gap-1.5 text-sm transition-transform group-hover:translate-x-0.5"
          style={{
            color: TOKENS.accent,
            fontFamily: "var(--font-newsreader)",
            fontStyle: "italic",
          }}
        >
          Find someone to talk to →
        </span>
      </div>
    </Link>
  );
}

function NoTopicState() {
  return (
    <div
      className="flex max-w-md flex-col items-start gap-3 overflow-hidden rounded-xl px-6 py-6"
      style={{
        backgroundColor: TOKENS.card,
        backgroundImage: CARD_GRAIN_URL,
        backgroundSize: "200px 200px",
        boxShadow:
          "0 1px 0 rgba(44,36,24,0.04), 0 12px 28px -16px rgba(76,52,18,0.30)",
        border: "1px solid rgba(44,36,24,0.08)",
      }}
    >
      <span
        className="text-[10px] uppercase tracking-[0.28em]"
        style={{
          color: TOKENS.accent,
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
        }}
      >
        Nothing selected
      </span>
      <h2
        className="text-2xl"
        style={{
          fontFamily: "var(--font-newsreader)",
          fontWeight: 500,
          letterSpacing: "-0.012em",
        }}
      >
        No topic chosen yet
      </h2>
      <p
        className="text-sm"
        style={{ color: TOKENS.inkMuted }}
      >
        Head back to the notebook and pick one.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-1.5 text-sm transition-transform hover:translate-x-0.5"
        style={{
          color: TOKENS.accent,
          fontStyle: "italic",
        }}
      >
        <ArrowLeft className="size-3.5" />
        Choose a topic
      </Link>
    </div>
  );
}
