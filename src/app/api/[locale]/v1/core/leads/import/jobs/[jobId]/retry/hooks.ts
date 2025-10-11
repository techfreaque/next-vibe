/**
 * Import Job Retry Action API Hooks
 * React hooks for retrying import jobs
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";

import definitions from "./definition";

/**
 * Hook for retrying import jobs
 * Uses the simplified interface with URL parameters as top-level option
 */
export function useRetryImportJobEndpoint(params: {
  jobId: string;
  enabled?: boolean;
}): EndpointReturn<typeof definitions> {
  // TODO: Fix URL parameter typing issue
  // For now, return a simplified hook without URL parameters
  return useEndpoint(definitions, {
    enabled: params.enabled,
    staleTime: 0, // Always fresh for actions
    refetchOnWindowFocus: false,
    persistForm: false,
  });
}
