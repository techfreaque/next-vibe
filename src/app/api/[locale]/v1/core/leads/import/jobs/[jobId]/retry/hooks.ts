/**
 * Import Job Retry Action API Hooks
 * React hooks for retrying import jobs
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for retrying import jobs
 */
export function useRetryImportJobEndpoint(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      staleTime: 0, // Always fresh for actions
      refetchOnWindowFocus: false,
      persistForm: false,
    },
    logger,
  );
}
