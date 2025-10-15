/**
 * IMAP Message Detail Hooks
 * React hooks for fetching individual IMAP messages
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";

import definitions from "./definition";

/**
 * Hook for fetching a single IMAP message
 */
export function useImapMessageById(
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

export type ImapMessageByIdEndpointReturn = EndpointReturn<
  typeof definitions.GET
>;
