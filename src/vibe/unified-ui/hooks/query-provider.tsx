"use client";

/**
 * React Query Provider
 * Client component wrapper for QueryClientProvider
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { JSX, ReactNode } from "react";
import { useState } from "react";

import { queryClient } from "./store";

// Expose queryClient for browser E2E test helpers (evaluate-script reads window.__queryClient)
if (typeof globalThis !== "undefined" && typeof document !== "undefined") {
  Object.assign(globalThis, { __queryClient: queryClient });
}

export function QueryProvider({
  children,
  isolateServerRender = false,
}: {
  children: ReactNode;
  /**
   * Web SSR: give each server render its own empty cache. The module-level
   * client is shared by every request (and server-side tool renders), so
   * rendering from it would put another user's cached data into this user's
   * HTML — and mismatch the empty cache the browser hydrates with.
   * CLI/MCP renders keep the shared client (long-lived, no hydration).
   */
  isolateServerRender?: boolean;
}): JSX.Element {
  const [client] = useState(() =>
    isolateServerRender && typeof window === "undefined"
      ? new QueryClient({ defaultOptions: queryClient.getDefaultOptions() })
      : queryClient,
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
