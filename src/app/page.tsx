import { ArrowRight } from "lucide-react";
import { TopicPicker } from "@/components/topic-picker";
import { availableTopics } from "@/lib/topics";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-12 md:px-6 md:py-16">
      <section className="flex flex-col items-center gap-4 text-center">
        <span className="border-border bg-muted text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
          Anonymous · One-on-one · Real-time
          <ArrowRight className="size-3" />
        </span>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Talk to someone who <span className="text-primary">disagrees</span> with you.
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg">
          Pick a topic. Pick a stance. We&rsquo;ll match you with someone holding the
          opposite view for a real conversation.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Pick a topic</h2>
            <p className="text-muted-foreground text-sm">
              Choose something you have an opinion on.
            </p>
          </div>
        </div>
        <TopicPicker topics={availableTopics} />
      </section>
    </div>
  );
}
