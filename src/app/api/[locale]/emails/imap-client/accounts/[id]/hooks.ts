/**
 * IMAP Account Hooks
 * React hooks for individual IMAP account operations
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import definitions from "./definition";

/**
 * Hook for IMAP account operations (get, update, delete)
 */
export function useImapAccountById(
  params: {
    accountId: string;
    enabled?: boolean;
  },
  user: JwtPayloadType,
  logger: EndpointLogger,
): ImapAccountByIdEndpointReturn {
  return useEndpoint(
    definitions,
    {
      read: {
        urlPathParams: { id: params.accountId },
        queryOptions: {
          enabled: params.enabled,
          staleTime: 5 * 60 * 1000,
          refetchOnWindowFocus: false,
        },
      },
      update: {
        formOptions: {
          persistForm: false,
          // eslint-disable-next-line i18next/no-literal-string
          persistenceKey: `imap-account-${params.accountId}-form`,
        },
      },
    },
    logger,
    user,
  );
}

// Export with alternative name for compatibility
export const useImapAccountByIdEndpoint = useImapAccountById;

export type ImapAccountByIdEndpointReturn = EndpointReturn<typeof definitions>;
