/**
 * Import Job Stop Action API Hooks
 * React hooks for stopping import jobs
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";

import definitions from "./definition";

/**
 * Hook for stopping import jobs
 */
export function useStopImportJobEndpoint(
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
