/**
 * IMAP Folders List API Route Handler
 * Handles GET requests for listing IMAP folders with filtering and pagination
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import type { Countries } from "@/i18n/core/config";

import { ImapFolderSortField, SortOrder } from "../../enum";
import { imapFoldersRepository } from "../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: ({ urlVariables, user, locale, logger }) =>
      imapFoldersRepository.listFolders(
        {
          page: urlVariables.page ?? 1,
          limit: urlVariables.limit ?? 20,
          accountId: urlVariables.accountId,
          sortBy: urlVariables.sortBy ?? [ImapFolderSortField.NAME],
          sortOrder: urlVariables.sortOrder ?? [SortOrder.ASC],
          search: urlVariables.search,
          specialUseType: urlVariables.specialUseType,
          syncStatus: urlVariables.syncStatus,
        },
        user,
        (locale.split("-")[1]?.toUpperCase() as Countries) || "GLOBAL",
        logger,
      ),
  },
});
