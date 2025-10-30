/**
 * SMTP Account Edit Hooks
 * React hooks for editing SMTP accounts
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

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
      urlPathParams: { id: params.accountId },
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

export type SmtpAccountByIdEndpointReturn = EndpointReturn<typeof definitions>;
