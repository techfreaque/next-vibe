/**
 * User Search API Hooks
 * React hooks for interacting with the user search API
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";

import userSearchEndpoints from "./definition";

/**
 * Hook for searching users using endpoint form state
 * The form manages the search query, and results are shown when search has minimum 1 character
 * @param logger - Endpoint logger for tracking operations
 * @returns Query result with users list data and form controls with full type inference
 */
export function useUserSearchEndpoint(
  logger: EndpointLogger,
): EndpointReturn<typeof userSearchEndpoints> {
  return useEndpoint(
    userSearchEndpoints,
    {
      enabled: true, // Always enabled to show all users initially
      refetchOnWindowFocus: false,
      staleTime: 30000, // 30 seconds
    },
    logger,
  );
}
