/**
 * IMAP Folders List API Route Handler
 * Handles GET requests for listing IMAP folders with filtering and pagination
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { ImapFolderSortField, SortOrder } from "../../enum";
import { imapFoldersRepository } from "../repository";
import endpoints from "./definition";

/**
 * Export handlers using endpointsHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: ({ data, user, locale, logger }) =>
      imapFoldersRepository.listFolders(
        {
          page: data.page ?? 1,
          limit: data.limit ?? 20,
          accountId: data.accountId,
          sortBy: data.sortBy ?? [ImapFolderSortField.NAME],
          sortOrder: data.sortOrder ?? [SortOrder.ASC],
          search: data.search,
          specialUseType: data.specialUseType,
          syncStatus: data.syncStatus,
        },
        user,
        locale,
        logger,
      ),
  },
});
