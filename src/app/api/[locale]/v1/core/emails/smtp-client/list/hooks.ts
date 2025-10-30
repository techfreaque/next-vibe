/**
 * SMTP Accounts List Hooks
 * React hooks for SMTP accounts list operations
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

/**
 * Hook for fetching SMTP accounts list
 */
export function useSmtpAccountsList(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 1 * 60 * 1000,
      },
    },
    logger,
  );
}

// Export with alternative name for compatibility
export const useSmtpAccountsListEndpoint = useSmtpAccountsList;

export type SmtpAccountsListEndpointReturn = EndpointReturn<typeof definitions>;
