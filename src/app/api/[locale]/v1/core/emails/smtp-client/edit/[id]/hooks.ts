/**
 * SMTP Account Edit Hooks
 * React hooks for editing SMTP accounts
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";

import definitions from "./definition";

/**
 * Hook for SMTP account operations (get, update, delete)
 */
export function useSmtpAccountById(
  params: {
    accountId: string;
    enabled?: boolean;
  },
  logger: EndpointLogger,
): SmtpAccountByIdEndpointReturn {
  return useEndpoint(
    definitions,
    {
      urlParams: { id: params.accountId },
      enabled: params.enabled,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      persistForm: false,
      // eslint-disable-next-line i18next/no-literal-string
      persistenceKey: `smtp-account-${params.accountId}-form`,
    },
    logger,
  );
}

// Export with alternative name for compatibility
export const useSmtpAccountByIdEndpoint = useSmtpAccountById;

export type SmtpAccountByIdEndpointReturn = EndpointReturn<typeof definitions>;
