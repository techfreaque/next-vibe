/**
 * Social API Hooks
 * Simplified hooks for interacting with the Social API
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";

import definitions from "./definition";

/**
 * Hook for social platform data with form capabilities and completion tracking
 */
export function useSocialEndpoint(params: {
  enabled?: boolean;
  logger: EndpointLogger;
}): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: params.enabled !== false,
        refetchOnWindowFocus: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      formOptions: {
        persistForm: false,
        persistenceKey: "business-audience-form",
      },
    },
    params.logger,
  );
}
