/**
 * Brand API Hooks
 * React hooks for interacting with the Brand API following template-api standards
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";

import definitions from "./definition";

/**
 * Hook for brand data with form capabilities
 * Uses the simplified interface with smart defaults
 */
export function useBrandEndpoint(params: {
  enabled?: boolean;
  logger: EndpointLogger;
}): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      enabled: params?.enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      persistForm: false,
      persistenceKey: "business-brand-form",
    },
    params.logger,
  );
}
