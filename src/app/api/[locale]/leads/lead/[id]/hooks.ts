/**
 * Lead Edit API Hooks
 * React hooks for interacting with individual lead endpoints following established patterns
 */

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import definitions from "./definition";

/**
 * Hook for individual lead operations (get, update)
 * Uses the simplified interface with URL parameters as top-level option
 * Following the cron pattern for consistency
 */
export function useLeadByIdEndpoint(
  user: JwtPayloadType,
  logger: EndpointLogger,
  params: {
    leadId: string;
    enabled?: boolean;
  },
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        urlPathParams: { id: params.leadId },
        queryOptions: {
          enabled: params.enabled,
          staleTime: 5 * 60 * 1000, // 5 minutes
          refetchOnWindowFocus: false,
        },
      },
      update: {
        formOptions: {
          persistForm: false,
          persistenceKey: `lead-edit-${params.leadId}-form`, // eslint-disable-line i18next/no-literal-string -- Form persistence key
        },
      },
    },
    logger,
    user,
  );
}

/**
 * Type exports for convenience
 */
export type LeadByIdEndpointHook = ReturnType<typeof useLeadByIdEndpoint>;
