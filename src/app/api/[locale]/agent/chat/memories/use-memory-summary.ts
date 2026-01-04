"use client";

import { useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { formatMemorySummary } from "./formatter";
import { useMemories } from "./hooks";

/**
 * Hook to fetch user memories ONLY when needed (conditional)
 * Used in debug view to show memories in system prompt
 *
 * IMPORTANT: This hook only fetches when enabled=true
 * This prevents unnecessary API calls when debug view is not active
 */
export function useMemorySummary(params: {
  enabled: boolean;
  userId: string | undefined;
  logger: EndpointLogger;
}): {
  memorySummary: string;
  isLoading: boolean;
  error: string | null;
} {
  const { enabled, userId, logger } = params;

  // Use proper endpoint hook - only fetches when enabled AND user is authenticated
  const shouldFetch = enabled && !!userId;
  const memoriesEndpoint = useMemories({ enabled: shouldFetch }, logger);

  // Format memories using shared formatter (DRY - same logic as backend)
  const memorySummary = useMemo(() => {
    if (!shouldFetch) {
      return "";
    }

    if (!memoriesEndpoint.read?.response?.success) {
      return "";
    }

    const memories = memoriesEndpoint.read.response.data?.memories ?? [];
    return formatMemorySummary(memories);
  }, [shouldFetch, memoriesEndpoint.read?.response]);

  return {
    memorySummary,
    isLoading: memoriesEndpoint.isLoading,
    error: memoriesEndpoint.error?.message ?? null,
  };
}
