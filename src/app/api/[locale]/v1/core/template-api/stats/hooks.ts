/**
 * Template Stats Hooks
 * Custom hooks for template statistics operations using useEndpoint pattern
 */

import { useMemo } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";

import definitions from "./definition";

/**
 * Hook for template statistics operations with enhanced TypeScript typing
 */
export function useTemplateStatsEndpoint(
  logger: EndpointLogger,
  params?: {
    enabled?: boolean;
  },
): EndpointReturn<typeof definitions> {
  const queryOptions = useMemo(
    () => ({
      enabled: params?.enabled !== false,
      refetchOnWindowFocus: true, // Refresh stats when window gains focus
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
    [params?.enabled],
  );

  return useEndpoint(
    definitions,
    {
      queryOptions,
    },
    logger,
  );
}
