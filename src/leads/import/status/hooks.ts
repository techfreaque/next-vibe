/**
 * Import Jobs Status API Hook
 * React hook for listing and monitoring import jobs
 */

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { EndpointReturn } from "next-vibe/unified-ui/hooks/endpoint-types";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";

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
