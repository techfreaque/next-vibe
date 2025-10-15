/**
 * IMAP Health Hooks
 * React hooks for monitoring IMAP health status
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";

import definitions from "./definition";

/**
 * Hook for fetching IMAP health status
 */
export function useImapHealth(
  logger: EndpointLogger,
): EndpointReturn<typeof definitions.GET> {
  return useEndpoint(
    definitions.GET,
    {
      persistForm: false,
    },
    logger,
  );
}

export type ImapHealthEndpointReturn = EndpointReturn<typeof definitions.GET>;
