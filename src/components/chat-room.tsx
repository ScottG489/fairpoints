"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { Conversation } from "@twilio/conversations";
import { ArrowLeft, Loader2, Send } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { findTopic, availableViewpoints } from "@/lib/topics";
import { fetchChatToken, joinChannel } from "@/lib/twilio";
import type { Message, ViewpointId } from "@/lib/types";

export function ChatRoom() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic");
  const viewpoint = searchParams.get("viewpoint") as ViewpointId | null;
  const topic = findTopic(topicId);
  const viewpointMeta = availableViewpoints.find((v) => v.id === viewpoint);

  if (!topic || !viewpointMeta) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-3">
          <CardTitle>Missing topic or viewpoint</CardTitle>
          <CardDescription>
            Start over by choosing a topic to debate.
          </CardDescription>
          <Link
            href="/"
            className={buttonVariants({ variant: "outline" })}
          >
            <ArrowLeft className="size-4" />
            Choose a topic
          </Link>
        </CardContent>
      </Card>
    );
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
  const [isJoining, setIsJoining] = React.useState(false);

  React.useEffect(() => {
    if (!tokenQuery.data) return;
    let cancelled = false;
    setIsJoining(true);
    joinChannel(tokenQuery.data.token, topic, viewpoint, (incoming) => {
      if (cancelled) return;
      setMessages((prev) =>
        prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming],
      );
    })
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

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Link
          href={`/viewpoint?topic=${encodeURIComponent(topic.id)}`}
          className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-3.5" />
          Change stance
        </Link>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {topic.name}
          </h1>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium",
              viewpoint === "agree"
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-700 dark:text-rose-400",
            )}
          >
            You {viewpointMeta.name.toLowerCase()}
          </span>
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardContent className="flex flex-1 flex-col gap-0 p-0">
          <MessageList
            messages={messages}
            identity={identity}
            isLoading={tokenQuery.isPending || isJoining}
            error={
              tokenQuery.error
                ? "Couldn't fetch chat token. Is the backend running?"
                : joinError
            }
          />
          <Separator />
          <MessageComposer
            disabled={!isReady}
            onSend={async (body) => {
              if (!conversation) return;
              await conversation.sendMessage(body);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function MessageList({
  messages,
  identity,
  isLoading,
  error,
}: {
  messages: Message[];
  identity: string | undefined;
  isLoading: boolean;
  error: string | null;
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
      className="flex min-h-[24rem] flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
    >
      {error ? (
        <div className="text-destructive m-auto text-sm">{error}</div>
      ) : isLoading ? (
        <div className="text-muted-foreground m-auto inline-flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" />
          Connecting you to a debate partner…
        </div>
      ) : messages.length === 0 ? (
        <div className="text-muted-foreground m-auto max-w-xs text-center text-sm">
          You&rsquo;re in. Say hello and stake out your position.
        </div>
      ) : (
        messages.map((m) => {
          const isOwn = identity ? m.author === identity : false;
          return (
            <div
              key={m.id}
              className={cn("flex flex-col gap-1", isOwn && "items-end")}
            >
              <span className="text-muted-foreground text-xs">
                {isOwn ? "You" : m.author}
              </span>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted rounded-bl-sm",
                )}
              >
                {m.body}
              </div>
            </div>
          );
        })
      )}
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
      className="bg-background flex items-center gap-2 px-3 py-3"
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={disabled ? "Connecting…" : "Make your case…"}
        disabled={disabled || sending}
        className="flex-1"
      />
      <Button
        type="submit"
        size="lg"
        disabled={disabled || sending || value.trim().length === 0}
      >
        <Send className="size-4" />
        Send
      </Button>
    </form>
  );
}
