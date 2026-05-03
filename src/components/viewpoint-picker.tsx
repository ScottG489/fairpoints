"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, ThumbsDown, ThumbsUp } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { availableViewpoints, findTopic } from "@/lib/topics";
import type { ViewpointId } from "@/lib/types";

const viewpointIcons: Record<ViewpointId, typeof ThumbsUp> = {
  agree: ThumbsUp,
  disagree: ThumbsDown,
};

export function ViewpointPicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic");
  const topic = findTopic(topicId);
  const [selected, setSelected] = React.useState<ViewpointId | null>(null);

  if (!topic) {
    return (
      <Card>
        <CardContent className="flex flex-col items-start gap-3">
          <CardTitle>No topic selected</CardTitle>
          <CardDescription>
            Head back and pick a topic to debate.
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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selected || !topic) return;
    router.push(
      `/chat?topic=${encodeURIComponent(topic.id)}&viewpoint=${encodeURIComponent(
        selected,
      )}`,
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-3.5" />
          Change topic
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {topic.name}
        </h1>
        <p className="text-muted-foreground text-base">
          What&rsquo;s your stance? You&rsquo;ll be matched with someone holding the
          opposite view.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {availableViewpoints.map((vp) => {
          const Icon = viewpointIcons[vp.id];
          const isSelected = selected === vp.id;
          return (
            <button
              type="button"
              key={vp.id}
              onClick={() => setSelected(vp.id)}
              className="text-left"
              aria-pressed={isSelected}
            >
              <Card
                className={cn(
                  "transition-all hover:border-primary/40 hover:shadow-sm",
                  isSelected && "border-primary ring-primary/30 ring-2",
                )}
              >
                <CardContent className="flex flex-col gap-3">
                  <Icon className="text-primary size-5" />
                  <CardTitle className="text-lg">{vp.name}</CardTitle>
                  <CardDescription>{vp.description}</CardDescription>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={!selected}>
          Find a debate partner
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
