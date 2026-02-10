/**
 * Users List API Hook
 * React hook for interacting with the Users List API
 */

import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { JwtPayloadType } from "../../user/auth/types";
import { SortOrder, UserSortField } from "../enum";
import definitions from "./definition";

/**
 * Hook for users list with filtering and pagination
 * Uses the enhanced useEndpoint library features for clean, minimal code
 * All filtering is handled through the form - no parameters needed
 */
export function useUsersListEndpoint(
  logger: EndpointLogger,
  user: JwtPayloadType,
): ReturnType<typeof useEndpoint<typeof definitions>> {
  return useEndpoint(
    definitions,
    {
      read: {
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: false, // Disable to prevent conflicts
          staleTime: 1 * 60 * 1000, // 1 minute
        },
        initialState: {
          searchFilters: {
            search: undefined,
            status: undefined,
            role: undefined,
          },
          sortingOptions: {
            sortBy: UserSortField.CREATED_AT,
            sortOrder: SortOrder.DESC,
          },
          paginationInfo: {
            page: 1,
            limit: 20,
          },
        },
      },
    },
    logger,
    user,
  );
}

export type UsersListEndpointReturn = ReturnType<typeof useUsersListEndpoint>;
