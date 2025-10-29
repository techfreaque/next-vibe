/**
 * IMAP Folders List Hooks
 * React hooks for listing IMAP folders
 */

"use client";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";
import { useEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/use-endpoint";

import definitions from "./definition";

/**
 * Hook for listing IMAP folders
 */
export function useImapFoldersList(
  accountId: string,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      queryOptions: {
        requestData: {
          accountId,
          page: 1,
          limit: 20,
          sortBy: ["NAME"] as const,
          sortOrder: ["ASC"] as const,
        },
      },
    },
    logger,
  );
}

export type ImapFoldersListEndpointReturn = EndpointReturn<typeof definitions>;
