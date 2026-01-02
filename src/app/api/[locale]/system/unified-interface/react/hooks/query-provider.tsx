"use client";

/**
 * React Query Provider
 * Client component wrapper for QueryClientProvider
 */

import { QueryClientProvider } from "@tanstack/react-query";
import type { JSX, ReactNode } from "react";

import { queryClient } from "@/app/api/[locale]/system/unified-interface/react/hooks/store";

export function QueryProvider({ children }: { children: ReactNode }): JSX.Element {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
