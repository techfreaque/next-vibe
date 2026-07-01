"use client";

/**
 * React Query Provider
 * Client component wrapper for QueryClientProvider
 */

import { QueryClientProvider } from "@tanstack/react-query";
import type { JSX, ReactNode } from "react";

import { queryClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";

// Expose queryClient for browser E2E test helpers (evaluate-script reads window.__queryClient)
if (typeof globalThis !== "undefined" && typeof document !== "undefined") {
  Object.assign(globalThis, { __queryClient: queryClient });
}

export function QueryProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
