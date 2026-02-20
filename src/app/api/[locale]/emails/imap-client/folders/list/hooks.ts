/**
 * IMAP Folders List Hooks
 * React hooks for listing IMAP folders
 */

"use client";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { ImapFolderSortField, SortOrder } from "../../enum";
import definitions from "./definition";

/**
 * Hook for listing IMAP folders
 */
export function useImapFoldersList(
  user: JwtPayloadType,
  accountId: string,
  logger: EndpointLogger,
): EndpointReturn<typeof definitions> {
  return useEndpoint(
    definitions,
    {
      read: {
        initialState: {
          accountId,
          page: 1,
          limit: 20,
          sortBy: ImapFolderSortField.NAME,
          sortOrder: SortOrder.ASC,
        },
      },
    },
    logger,
    user,
  );
}

export type ImapFoldersListEndpointReturn = EndpointReturn<typeof definitions>;
