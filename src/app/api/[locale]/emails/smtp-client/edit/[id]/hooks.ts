/**
 * SMTP Account Edit Hooks
 * React hooks for editing SMTP accounts
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

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
  user: JwtPayloadType,
): SmtpAccountByIdEndpointReturn {
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
          persistenceKey: `smtp-account-${params.accountId}-form`,
        },
      },
    },
    logger,
    user,
  );
}

export type SmtpAccountByIdEndpointReturn = EndpointReturn<typeof definitions>;
