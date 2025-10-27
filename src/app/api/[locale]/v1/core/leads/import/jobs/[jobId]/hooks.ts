/**
 * Import Job Management API Hooks
 * React hooks for individual job operations (update, delete)
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/endpoint-logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for import job operations (update and delete)
 */
export function useImapJobEndpoint(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      staleTime: 0, // Always fresh for job operations
      refetchOnWindowFocus: false,
      persistForm: false,
    },
    logger,
  );
}
