/**
 * IMAP Folders List API Route Handler
 * Handles GET requests for listing IMAP folders with filtering and pagination
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { ImapFolderSortField, SortOrder } from "../../enum";
import { imapFoldersRepository } from "../repository";
import endpoints from "./definition";

/**
 * Export handlers using endpointHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: ({ urlPathParams, user, locale, logger }) =>
      imapFoldersRepository.listFolders(
        {
          page: urlPathParams.page ?? 1,
          limit: urlPathParams.limit ?? 20,
          accountId: urlPathParams.accountId,
          sortBy: urlPathParams.sortBy ?? [ImapFolderSortField.NAME],
          sortOrder: urlPathParams.sortOrder ?? [SortOrder.ASC],
          search: urlPathParams.search,
          specialUseType: urlPathParams.specialUseType,
          syncStatus: urlPathParams.syncStatus,
        },
        user,
        locale,
        logger,
      ),
  },
});
