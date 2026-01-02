/**
 * IMAP Messages List Hooks
 * React hooks for listing IMAP messages
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import definitions from "./definition";

/**
 * Hook for listing IMAP messages
 */
export function useImapMessagesList(logger: EndpointLogger): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      persistForm: false,
    },
    logger,
  );
}

// Export with alternative name for compatibility
export const useImapMessagesListEndpoint = useImapMessagesList;

export type ImapMessagesListEndpointReturn = EndpointReturn<typeof definitions>;
