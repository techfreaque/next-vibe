/**
 * IMAP Account Hooks
 * React hooks for individual IMAP account operations
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint";

import definitions from "./definition";

/**
 * Hook for IMAP account operations (get, update, delete)
 */
export function useImapAccountById(
  params: {
    accountId: string;
    enabled?: boolean;
  },
  logger: EndpointLogger,
): ImapAccountByIdEndpointReturn {
  return useEndpoint(
    definitions,
    {
      urlPathParams: { id: params.accountId },
      enabled: params.enabled,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      persistForm: false,
      // eslint-disable-next-line i18next/no-literal-string
      persistenceKey: `imap-account-${params.accountId}-form`,
    },
    logger,
  );
}

// Export with alternative name for compatibility
export const useImapAccountByIdEndpoint = useImapAccountById;

export type ImapAccountByIdEndpointReturn = EndpointReturn<typeof definitions>;
