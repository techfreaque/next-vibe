/**
 * Email Messages Stats Hooks
 * React hooks for email statistics and analytics
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for fetching email statistics
 */
export function useEmailMessagesStats(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      persistForm: false,
    },
    logger,
  );
}

export type EmailMessagesStatsEndpointReturn = EndpointReturn<
  typeof definitions
>;
