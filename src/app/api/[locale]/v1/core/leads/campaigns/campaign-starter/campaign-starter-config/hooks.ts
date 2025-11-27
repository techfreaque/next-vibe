/**
 * Campaign Starter Configuration Hooks
 * Client-side hooks for managing campaign starter configuration
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

/**
 * Hook for campaign starter configuration with form capabilities
 */
export function useCampaignStarterConfigEndpoint(
  logger: EndpointLogger,
  params?: {
    enabled?: boolean;
  },
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: params?.enabled !== false,
        refetchOnWindowFocus: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      formOptions: {
        persistForm: false,
        persistenceKey: "campaign-starter-config-form",
      },
    },
    logger,
  );
}
