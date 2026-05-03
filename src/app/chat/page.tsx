import { Suspense } from "react";
import { ChatRoom } from "@/components/chat-room";

export default function ChatPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 md:px-6 md:py-10">
      <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
        <ChatRoom />
      </Suspense>
    </div>
  );
}
