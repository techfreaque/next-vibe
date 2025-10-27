/**
 * IMAP Folder Sync API Route Handler
 * Handles POST requests for syncing IMAP folders
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import { imapFoldersRepository } from "../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointHandler
 */
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return await imapFoldersRepository.syncFolders(
        {
          accountId: data.accountId,
          force: data.force ?? false,
          folderId: data.folderId,
        },
        user,
        locale,
        logger,
      );
    },
  },
});
