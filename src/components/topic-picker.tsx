"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Topic } from "@/lib/types";

interface Props {
  topics: Topic[];
}

export function TopicPicker({ topics }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedId) return;
    router.push(`/viewpoint?topic=${encodeURIComponent(selectedId)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        {topics.map((topic) => {
          const isSelected = selectedId === topic.id;
          return (
            <button
              type="button"
              key={topic.id}
              onClick={() => setSelectedId(topic.id)}
              className="text-left"
              aria-pressed={isSelected}
            >
              <Card
                className={cn(
                  "transition-all hover:border-primary/40 hover:shadow-sm",
                  isSelected &&
                    "border-primary ring-primary/30 ring-2",
                )}
              >
                <CardContent className="flex flex-col gap-2">
                  <CardTitle className="text-lg">{topic.name}</CardTitle>
                  {topic.blurb ? (
                    <CardDescription>{topic.blurb}</CardDescription>
                  ) : null}
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={!selectedId}>
          Continue
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
