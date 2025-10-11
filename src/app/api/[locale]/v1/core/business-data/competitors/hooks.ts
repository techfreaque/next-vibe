/**
 * Competitors API Hooks
 * React hooks for interacting with the Competitors API following template-api standards
 */

import { useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";

import definitions from "./definition";

/**
 * Hook for competitors data with form capabilities and completion tracking
 */
export function useCompetitorsEndpoint(params: {
  enabled?: boolean;
  logger: EndpointLogger;
}): EndpointReturn<typeof definitions> {
  const queryOptions = useMemo(
    () => ({
      enabled: params?.enabled !== false,
      refetchOnWindowFocus: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
    [params?.enabled],
  );

  const formOptions = useMemo(
    () => ({
      persistForm: false,
      persistenceKey: "business-competitors-form",
    }),
    [],
  );

  return useEndpoint(
    definitions,
    {
      queryOptions,
      formOptions,
    },
    params.logger,
  );
}
