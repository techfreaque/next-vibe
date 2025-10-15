/**
 * IMAP Messages List Hooks
 * React hooks for listing IMAP messages
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/use-endpoint";

import definitions from "./definition";

/**
 * Hook for listing IMAP messages
 */
export function useImapMessagesList(
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

export type ImapMessagesListEndpointReturn = EndpointReturn<
  typeof definitions.GET
>;
