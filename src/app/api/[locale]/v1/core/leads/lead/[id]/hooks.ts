/**
 * Lead Edit API Hooks
 * React hooks for interacting with individual lead endpoints following established patterns
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for individual lead operations (get, update)
 * Uses the simplified interface with URL parameters as top-level option
 * Following the cron pattern for consistency
 */
export function useLeadByIdEndpoint(
  logger: EndpointLogger,
  params: {
    leadId: string;
    enabled?: boolean;
  },
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      urlPathParams: { id: params.leadId }, // URL parameters as top-level option
      enabled: params.enabled,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      persistForm: false,
      persistenceKey: `lead-edit-${params.leadId}-form`, // eslint-disable-line i18next/no-literal-string -- Form persistence key
    },
    logger,
  );
}

/**
 * Type exports for convenience
 */
export type LeadByIdEndpointHook = ReturnType<typeof useLeadByIdEndpoint>;
