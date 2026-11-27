"use client";

import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import { AgentAvailabilityProvider } from "next-vibe/agent/env-availability-store";
import type { JSX, ReactNode } from "react";

/**
 * Root-layout boundary for the agent availability store.
 *
 * The store module is also a client reference from other server graphs (the
 * `[locale]` redirect page imports it through endpoint definitions). Next.js
 * then attached that page's whole client chunk group (model catalogue,
 * incognito threads, votes: ~530 KB raw) to the store's reference on EVERY
 * route, because the root layout rendered the store's provider directly.
 * This file is a client reference only the root layout uses, so its chunk
 * list is the layout's own.
 */
export function RootAgentAvailability({
  availability,
  children,
}: {
  availability: AgentEnvAvailability;
  children: ReactNode;
}): JSX.Element {
  return (
    <AgentAvailabilityProvider availability={availability}>
      {children}
    </AgentAvailabilityProvider>
  );
}
