/**
 * Individual User API Hook
 * React hook for individual user operations (get, update, delete)
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";

import definitions from "./definition";

/**
 * Hook for individual user operations (get, update, delete)
 * Uses the simplified interface with URL parameters as top-level option
 * Following the cron pattern for consistency
 */
export function useUserByIdEndpoint(
  params: {
    userId: string;
    enabled?: boolean;
  },
  logger: EndpointLogger,
): UserByIdEndpointHook {
  return useEndpoint(
    definitions,
    {
      urlParams: { id: params.userId }, // URL parameters as top-level option
      enabled: params.enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      persistForm: false,
      persistenceKey: `user-edit-${params.userId}-form`, // eslint-disable-line i18next/no-literal-string -- Form persistence key
    },
    logger,
  );
}

/**
 * Type exports for convenience
 */
export type UserByIdEndpointHook = EndpointReturn<typeof definitions>;
