"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { Conversation } from "@twilio/conversations";
import { ArrowLeft, Loader2, Send } from "lucide-react";

import {
  CARD_GRAIN_URL,
  PASTELS,
  type Pastel,
  TOKENS,
} from "@/lib/brand";
import { availableViewpoints, findTopic } from "@/lib/topics";
import { fetchChatToken, joinChannel } from "@/lib/twilio";
import type { Message, ViewpointId } from "@/lib/types";

const stancePastel: Record<ViewpointId, Pastel> = {
  agree: PASTELS[1], // sage
  disagree: PASTELS[0], // rose
};

export function ChatRoom() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic");
  const viewpoint = searchParams.get("viewpoint") as ViewpointId | null;
  const topic = findTopic(topicId);
  const viewpointMeta = availableViewpoints.find((v) => v.id === viewpoint);

  if (!topic || !viewpointMeta) {
    return <MissingState />;
  }

  return <ChatRoomConnected topic={topic.id} viewpoint={viewpointMeta.id} />;
}

function ChatRoomConnected({
  topic: topicId,
  viewpoint,
}: {
  topic: string;
  viewpoint: ViewpointId;
}) {
  const topic = findTopic(topicId)!;
  const viewpointMeta = availableViewpoints.find((v) => v.id === viewpoint)!;

  const tokenQuery = useQuery({
    queryKey: ["chat-token"],
    queryFn: fetchChatToken,
    staleTime: Infinity,
    retry: 1,
  });

  const [conversation, setConversation] = React.useState<Conversation | null>(
    null,
  );
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [joinError, setJoinError] = React.useState<string | null>(null);
  const [sendError, setSendError] = React.useState<string | null>(null);
  const [isJoining, setIsJoining] = React.useState(false);

  React.useEffect(() => {
    if (!tokenQuery.data) return;
    let cancelled = false;
    setIsJoining(true);
    joinChannel(
      tokenQuery.data.token,
      tokenQuery.data.identity,
      topic,
      viewpoint,
      (incoming) => {
        if (cancelled) return;
        setMessages((prev) =>
          prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming],
        );
      },
    )
      .then(({ conversation, initialMessages }) => {
        if (cancelled) return;
        setConversation(conversation);
        setMessages(initialMessages);
      })
      .catch((e) => {
        if (cancelled) return;
        setJoinError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setIsJoining(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tokenQuery.data, topic, viewpoint]);

  const isReady = !!conversation && !isJoining;
  const identity = tokenQuery.data?.identity;
  const myPastel = stancePastel[viewpoint];
  const theirPastel = viewpoint === "agree" ? PASTELS[0] : PASTELS[1];

  return (
    <div className="flex flex-1 flex-col gap-5">
      <ConversationHeader topic={topic} viewpointMeta={viewpointMeta} />
      <ConversationCard>
        <MessageList
          messages={messages}
          identity={identity}
          isLoading={tokenQuery.isPending || isJoining}
          error={
            tokenQuery.error
              ? "Couldn't reach the matchmaker. Is the backend running?"
              : (joinError ?? sendError)
          }
          myPastel={myPastel}
          theirPastel={theirPastel}
        />
        <Divider />
        <MessageComposer
          disabled={!isReady}
          onSend={async (body) => {
            if (!conversation) return;
            setSendError(null);
            try {
              await conversation.sendMessage(body);
            } catch (e) {
              console.error("[fair-points] sendMessage failed", e);
              setSendError(e instanceof Error ? e.message : String(e));
              throw e;
            }
          }}
        />
      </ConversationCard>
    </div>
  );
}

function ConversationHeader({
  topic,
  viewpointMeta,
}: {
  topic: { id: string; name: string };
  viewpointMeta: { id: ViewpointId; chipLabel: string };
}) {
  const pastel = stancePastel[viewpointMeta.id];
  return (
    <div className="flex flex-col gap-2">
      <Link
        href={`/viewpoint?topic=${encodeURIComponent(topic.id)}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm transition-colors hover:text-[color:var(--foreground)]"
        style={{ color: TOKENS.inkMuted }}
      >
        <ArrowLeft className="size-3.5" />
        Change stance
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1
          className="text-2xl md:text-3xl"
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 500,
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
          }}
        >
          {topic.name}
        </h1>
        <span
          className="text-[10px] uppercase tracking-[0.22em]"
          style={{
            backgroundColor: pastel.bg,
            color: pastel.ink,
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 999,
            border: "1px solid rgba(44,36,24,0.08)",
          }}
        >
          {viewpointMeta.chipLabel}
        </span>
      </div>
    </div>
  );
}

function ConversationCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-1 flex-col overflow-hidden rounded-xl"
      style={{
        backgroundColor: TOKENS.card,
        backgroundImage: CARD_GRAIN_URL,
        backgroundSize: "200px 200px",
        boxShadow:
          "0 1px 0 rgba(44,36,24,0.04), 0 12px 28px -16px rgba(76,52,18,0.30)",
        border: "1px solid rgba(44,36,24,0.08)",
      }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        borderTop: "1px solid rgba(44,36,24,0.08)",
      }}
    />
  );
}

function MessageList({
  messages,
  identity,
  isLoading,
  error,
  myPastel,
  theirPastel,
}: {
  messages: Message[];
  identity: string | undefined;
  isLoading: boolean;
  error: string | null;
  myPastel: Pastel;
  theirPastel: Pastel;
}) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  return (
    <div
      ref={scrollRef}
      className="flex min-h-[24rem] flex-1 flex-col gap-4 overflow-y-auto px-5 py-5"
    >
      {error ? (
        <div
          className="m-auto max-w-xs text-center text-sm"
          style={{
            color: "#B45A4B",
            fontStyle: "italic",
          }}
        >
          {error}
        </div>
      ) : isLoading ? (
        <div
          className="m-auto inline-flex items-center gap-2 text-sm italic"
          style={{ color: TOKENS.inkMuted }}
        >
          <Loader2 className="size-4 animate-spin" />
          Finding someone to talk to…
        </div>
      ) : messages.length === 0 ? (
        <div
          className="m-auto max-w-xs text-center text-sm italic"
          style={{ color: TOKENS.inkMuted }}
        >
          You&rsquo;re in. Say hello and share where you&rsquo;re coming from.
        </div>
      ) : (
        messages.map((m) => {
          const isOwn = identity ? m.author === identity : false;
          const pastel = isOwn ? myPastel : theirPastel;
          return (
            <MessageBubble
              key={m.id}
              body={m.body}
              isOwn={isOwn}
              pastel={pastel}
              authorLabel={isOwn ? "you" : "them"}
            />
          );
        })
      )}
    </div>
  );
}

function MessageBubble({
  body,
  isOwn,
  pastel,
  authorLabel,
}: {
  body: string;
  isOwn: boolean;
  pastel: Pastel;
  authorLabel: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}>
      <span
        className="text-[10px] uppercase tracking-[0.22em]"
        style={{
          color: pastel.ink,
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
        }}
      >
        {authorLabel}
      </span>
      <div
        className="max-w-[80%] rounded-xl px-4 py-2.5 text-base leading-relaxed"
        style={{
          backgroundColor: pastel.bg,
          color: pastel.ink,
          border: "1px solid rgba(44,36,24,0.08)",
          boxShadow:
            "0 1px 0 rgba(44,36,24,0.04), 0 6px 14px -10px rgba(76,52,18,0.25)",
          fontFamily: "var(--font-newsreader)",
          // Slightly different corner shaping per side, like a chat bubble
          borderTopLeftRadius: isOwn ? 12 : 4,
          borderTopRightRadius: isOwn ? 4 : 12,
        }}
      >
        {body}
      </div>
    </div>
  );
}

function MessageComposer({
  onSend,
  disabled,
}: {
  onSend: (body: string) => Promise<void>;
  disabled: boolean;
}) {
  const [value, setValue] = React.useState("");
  const [sending, setSending] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const body = value.trim();
    if (!body || disabled || sending) return;
    setSending(true);
    try {
      await onSend(body);
      setValue("");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 px-4 py-3"
      style={{ backgroundColor: "rgba(44,36,24,0.03)" }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={
          disabled
            ? "Connecting…"
            : "Where are you coming from?"
        }
        disabled={disabled || sending}
        className="flex-1 rounded-lg px-3 py-2 text-base outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
        style={{
          backgroundColor: TOKENS.card,
          border: "1px solid rgba(44,36,24,0.14)",
          color: TOKENS.ink,
          fontFamily: "var(--font-newsreader)",
        }}
      />
      <button
        type="submit"
        disabled={disabled || sending || value.trim().length === 0}
        className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition-colors disabled:opacity-50"
        style={{
          backgroundColor: TOKENS.accent,
          color: TOKENS.card,
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
      >
        <Send className="size-4" />
        Send
      </button>
    </form>
  );
}

function MissingState() {
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
        Start over by picking a topic
      </h2>
      <p className="text-sm" style={{ color: TOKENS.inkMuted }}>
        We need a topic and a stance to find someone to talk to.
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
