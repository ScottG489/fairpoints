import { Suspense } from "react";
import { ViewpointPicker } from "@/components/viewpoint-picker";

export default function ViewpointPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 md:px-6 md:py-16">
      <Suspense fallback={<div className="text-muted-foreground">Loading…</div>}>
        <ViewpointPicker />
      </Suspense>
    </div>
  );
}
