/**
 * Consultation Admin API Hooks
 * Client-side hooks for consultation admin endpoints
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";

import { ConsultationSortField, SortOrder } from "../enum";
import consultationByIdDefinition from "./consultation/[id]/definition";
import consultationsListDefinition from "./list/definition";
import consultationStatsDefinition from "./stats/definition";

/**
 * Hook for getting a single consultation by ID
 */
export function useConsultationAdminEndpoint(params: {
  consultationId: string;
  enabled?: boolean;
  logger: EndpointLogger;
}): ConsultationGetEndpointReturn {
  return useEndpoint(
    consultationByIdDefinition,
    {
      urlParams: { id: params.consultationId },
      enabled: params.enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      persistForm: false,
      // eslint-disable-next-line i18next/no-literal-string -- Form persistence key
      persistenceKey: `consultation-edit-${params.consultationId}-form`,
    },
    params.logger,
  );
}

/**
 * Hook for getting consultations list with filtering and pagination
 */
export function useConsultationsListEndpoint(
  logger: EndpointLogger,
): ConsultationsListEndpointReturn {
  return useEndpoint(
    consultationsListDefinition,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 1 * 60 * 1000, // 1 minute
      },
      filterOptions: {
        initialFilters: {
          page: 1,
          limit: 20,
          status: [], // Empty array means no status filter (show all)
          sortBy: ConsultationSortField.CREATED_AT,
          sortOrder: SortOrder.DESC,
        },
      },
    },
    logger,
  );
}

/**
 * Hook for getting consultation statistics
 */
export function useConsultationStatsEndpoint(
  logger: EndpointLogger,
): ConsultationStatsEndpointReturn {
  return useEndpoint(
    consultationStatsDefinition,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
    logger,
  );
}

export type ConsultationGetEndpointReturn = EndpointReturn<
  typeof consultationByIdDefinition
>;
export type ConsultationsListEndpointReturn = EndpointReturn<
  typeof consultationsListDefinition
>;
export type ConsultationStatsEndpointReturn = EndpointReturn<
  typeof consultationStatsDefinition
>;
