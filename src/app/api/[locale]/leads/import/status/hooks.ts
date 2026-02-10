/**
 * Import Jobs Status API Hook
 * React hook for listing and monitoring import jobs
 */

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import definitions from "./definition";

/**
 * Hook for import jobs status with filtering
 */
export function useImportJobsStatusEndpoint(
  user: JwtPayloadType,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        queryOptions: {
          enabled: true,
          refetchOnWindowFocus: false,
          staleTime: 10 * 1000, // 10 seconds (for real-time monitoring)
        },
        initialState: {
          filters: {
            status: undefined,
            limit: 50,
            offset: 0,
          },
        },
      },
    },
    logger,
    user,
  );
}

export type ImportJobsStatusEndpointReturn = EndpointReturn<typeof definitions>;
