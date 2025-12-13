/**
 * IMAP Folder Sync API Route Handler
 * Handles POST requests for syncing IMAP folders
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { imapFoldersRepository } from "../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointsHandler
 */
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      return await imapFoldersRepository.syncFolders(
        {
          accountId: data.accountId,
          force: data.force ?? false,
          folderId: data.folderId,
        },
        logger,
      );
    },
  },
});
