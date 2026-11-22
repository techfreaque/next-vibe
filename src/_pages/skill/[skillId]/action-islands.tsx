"use client";

import { type ComponentProps, type JSX, lazy, Suspense } from "react";

const ShareEarnAction = lazy(async () => ({
  default: (await import("./landing-actions")).ShareEarnAction,
}));
const AddToSkillsAction = lazy(async () => ({
  default: (await import("./landing-actions")).AddToSkillsAction,
}));
const LeadCapture = lazy(async () => ({
  default: (await import("./landing-actions")).LeadCaptureIsland,
}));

export function SignedInActions({
  share,
  add,
}: {
  share: ComponentProps<typeof ShareEarnAction>;
  add: ComponentProps<typeof AddToSkillsAction>;
}): JSX.Element {
  return (
    <Suspense fallback={null}>
      <ShareEarnAction {...share} />
      <AddToSkillsAction {...add} />
    </Suspense>
  );
}

export function LeadCaptureIsland(
  props: ComponentProps<typeof LeadCapture>,
): JSX.Element {
  return (
    <Suspense fallback={null}>
      <LeadCapture {...props} />
    </Suspense>
  );
}
