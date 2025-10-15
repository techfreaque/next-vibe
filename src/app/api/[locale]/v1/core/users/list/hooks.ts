/**
 * Users List API Hook
 * React hook for interacting with the Users List API
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";

import definitions from "./definition";

/**
 * Hook for users list with filtering and pagination
 * Uses the enhanced useEndpoint library features for clean, minimal code
 * All filtering is handled through the form - no parameters needed
 */
export function useUsersListEndpoint(
  logger: EndpointLogger,
): ReturnType<typeof useEndpoint<typeof definitions>> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: false, // Disable to prevent conflicts
        staleTime: 1 * 60 * 1000, // 1 minute
      },
      filterOptions: {
        initialFilters: undefined,
      },
    },
    logger,
  );
}

export type UsersListEndpointReturn = ReturnType<typeof useUsersListEndpoint>;
