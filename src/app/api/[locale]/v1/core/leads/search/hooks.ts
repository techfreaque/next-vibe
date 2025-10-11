/**
 * Lead Search API Hooks
 * React hooks for interacting with the lead search API
 */

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";

import leadSearchEndpoints from "./definition";

/**
 * Hook for searching leads using endpoint form state
 * The form manages the search query, and results are shown when search has minimum 1 character
 * @returns Query result with leads list data and form controls with full type inference
 */
export function useLeadSearchEndpoint(
  logger: EndpointLogger,
): EndpointReturn<typeof leadSearchEndpoints> {
  return useEndpoint(
    leadSearchEndpoints,
    {
      enabled: true, // Always enabled to show all leads initially
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 seconds
    },
    logger,
  );
}
