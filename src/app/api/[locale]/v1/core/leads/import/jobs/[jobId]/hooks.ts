/**
 * Import Job Management API Hooks
 * React hooks for individual job operations (update, delete)
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";

import definitions from "./definition";

/**
 * Hook for import job operations (update and delete)
 * Uses the simplified interface with URL parameters as top-level option
 */
export function useImportJobEndpoint(params: {
  jobId: string;
  enabled?: boolean;
}): EndpointReturn<typeof definitions> {
  // TODO: Fix URL parameter typing issue
  // For now, return a simplified hook without URL parameters
  return useEndpoint(definitions, {
    enabled: params.enabled,
    staleTime: 0, // Always fresh for job operations
    refetchOnWindowFocus: false,
    persistForm: false,
    // eslint-disable-next-line i18next/no-literal-string
    persistenceKey: `import-job-${params.jobId}-form`,
  });
}
