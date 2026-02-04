/**
 * IMAP Messages List Hooks
 * React hooks for listing IMAP messages
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import definitions from "./definition";

/**
 * Hook for listing IMAP messages
 */
export function useImapMessagesList(
  user: JwtPayloadType,
  logger: EndpointLogger,
): ImapMessagesListEndpointReturn {
  return useEndpoint(
    definitions,
    {
      persistForm: false,
    },
    logger,
    user,
  );
}

export type ImapMessagesListEndpointReturn = EndpointReturn<typeof definitions>;
