/**
 * Leads List API Hook
 * React hook for interacting with the Leads List API
 */

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { JwtPayloadType } from "../../user/auth/types";
import { LeadSortField, SortOrder } from "../enum";
import definitions from "./definition";

/**
 * Hook for leads list with filtering and pagination
 * Uses the enhanced useEndpoint library features for clean, minimal code
 * All filtering is handled through the form - no parameters needed
 */
export function useLeadsListEndpoint(
  logger: EndpointLogger,
  user: JwtPayloadType,
): EndpointReturn<typeof definitions> {
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
          paginationInfo: {
            page: 1,
            limit: 20,
          },
          sortingOptions: {
            sortBy: LeadSortField.CREATED_AT,
            sortOrder: SortOrder.DESC,
          },
        },
      },
    },
    logger,
    user,
  );
}

export type LeadsListEndpointReturn = EndpointReturn<typeof definitions>;
