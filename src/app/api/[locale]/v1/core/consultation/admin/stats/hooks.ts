/**
 * Consultation Stats API Hook
 * React hook for interacting with the Consultation Stats API
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { ChartType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";

import { ConsultationStatus } from "../../enum";
import definitions from "./definition";
import { DateRangePreset, TimePeriod } from "./enum";

/**
 * Hook for consultation statistics with filtering and historical data
 */
export function useConsultationStatsEndpoint(
  logger: EndpointLogger,
): ConsultationStatsEndpointReturn {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 30 * 1000, // 30 seconds
      },
      filterOptions: {
        initialFilters: {
          timePeriod: TimePeriod.DAY,
          dateRangePreset: DateRangePreset.LAST_30_DAYS,
          chartType: ChartType.LINE,
          status: [ConsultationStatus.PENDING],
        },
      },
    },
    logger,
  );
}

export type ConsultationStatsEndpointReturn = EndpointReturn<
  typeof definitions
>;
