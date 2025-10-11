/**
 * Business Data API Hooks
 * React hooks for business data completion status following template-api standards
 */

import { useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";

import definitions from "./definition";

/**
 * Hook for business data completion status
 */
export function useBusinessDataEndpoint(params: {
  enabled?: boolean;
  logger: EndpointLogger;
}): EndpointReturn<typeof definitions> {
  const queryOptions = useMemo(
    () => ({
      enabled: params.enabled !== false,
      refetchOnWindowFocus: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
    [params.enabled],
  );

  return useEndpoint(
    definitions,
    {
      queryOptions,
    },
    params.logger,
  );
}
