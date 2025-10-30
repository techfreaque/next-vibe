/**
 * IMAP Configuration Hooks
 * React hooks for managing IMAP configuration
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

/**
 * Hook for fetching IMAP configuration
 */
export function useImapConfig(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000, // 60 seconds
      },
    },
    logger,
  );
}

export type ImapConfigEndpointReturn = EndpointReturn<typeof definitions>;
