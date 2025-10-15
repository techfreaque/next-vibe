/**
 * IMAP Folder Sync API Route Handler
 * Handles POST requests for syncing IMAP folders
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import type { Countries } from "@/i18n/core/config";

import { imapFoldersRepository } from "../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointHandler
 */
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      imapFoldersRepository.syncFolders(
        {
          accountId: data.accountId,
          force: data.force ?? false,
          folderId: data.folderId,
        },
        user,
        (locale.split("-")[1]?.toUpperCase() as Countries) || "GLOBAL",
        logger,
      ),
  },
});
