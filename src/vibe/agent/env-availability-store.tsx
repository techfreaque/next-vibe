/**
 * Agent Availability Store (Zustand)
 *
 * Source of truth flow:
 * 1. Server page calls `getEnvAvailability()` — env flags plus live
 *    connections-DB inference state, which only the server can read.
 * 2. Page wraps children in <AgentAvailabilityProvider> with that value.
 * 3. The provider seeds the store on its own render, before any child renders,
 *    so the value is defined from the very first render — SSR included.
 * 4. Components read it via useProviderAvailability().
 * 5. Code outside React — client route handlers and endpoint event handlers,
 *    both invoked by vibe core — reads it via getClientAvailability().
 *
 * Nothing here computes availability: the client never touches env flags, it
 * only holds what the server handed it. The server-only `env-availability.ts`
 * is never imported at runtime — the type crosses as a type-only import, which
 * erases at compile time.
 *
 * A single module-level store, not a context-scoped one: there is exactly one
 * availability per surface, so nothing needs its own scoped instance. Step 5 is
 * why it is a store at all — those handlers run outside the tree and cannot
 * call a hook, which is what lets vibe core drop `AgentEnvAvailability` from
 * its handler contexts entirely.
 */

"use client";

import type { JSX, ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { createStore } from "zustand";

import type { AgentEnvAvailability } from "./env-availability";

interface AgentAvailabilityState {
  /** Null only before the provider's first render — never observed by readers. */
  availability: AgentEnvAvailability | null;
}

const store = createStore<AgentAvailabilityState>(() => ({
  availability: null,
}));

/**
 * Seeds the store with the value its surface computed. The root layout passes
 * `getEnvAvailability()`; CLI, MCP and native pass `getEnvAvailability()`,
 * since none of them has connections-DB state.
 *
 * Seeding happens during this component's own render, which React runs before
 * any child's — so every reader below sees a defined value, SSR included.
 */
export function AgentAvailabilityProvider({
  availability,
  children,
}: {
  availability: AgentEnvAvailability;
  children: ReactNode;
}): JSX.Element {
  if (store.getState().availability !== availability) {
    store.setState({ availability });
  }
  return <>{children}</>;
}

/** Availability for agent components. Re-renders when the value changes. */
export function useProviderAvailability(): AgentEnvAvailability {
  const availability = useSyncExternalStore(
    store.subscribe,
    () => store.getState().availability,
    () => store.getState().availability,
  );
  if (!availability) {
    // oxlint-disable-next-line restricted/restricted-syntax
    throw new Error(
      "useProviderAvailability requires an AgentAvailabilityProvider above it",
    );
  }
  return availability;
}

/** Availability outside React — client route handlers, event handlers. */
export function getClientAvailability(): AgentEnvAvailability {
  const { availability } = store.getState();
  if (!availability) {
    // oxlint-disable-next-line restricted/restricted-syntax
    throw new Error(
      "getClientAvailability called before AgentAvailabilityProvider rendered",
    );
  }
  return availability;
}
