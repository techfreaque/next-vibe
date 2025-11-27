/**
 * Leads List API Hook
 * React hook for interacting with the Leads List API
 */

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import { LeadSortField, SortOrder } from "../enum";
import definitions from "./definition";

/**
 * Hook for leads list with filtering and pagination
 * Uses the enhanced useEndpoint library features for clean, minimal code
 * All filtering is handled through the form - no parameters needed
 */
export function useLeadsListEndpoint(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: false, // Disable to prevent conflicts
        staleTime: 1 * 60 * 1000, // 1 minute
      },
      filterOptions: {
        initialFilters: {
          searchPagination: {
            page: 1,
            limit: 20,
          },
          statusFilters: {
            status: undefined,
            currentCampaignStage: undefined,
          },
          sortingOptions: {
            sortBy: LeadSortField.CREATED_AT,
            sortOrder: SortOrder.DESC,
          },
        },
      },
    },
    logger,
  );
}

export type LeadsListEndpointReturn = EndpointReturn<typeof definitions>;
