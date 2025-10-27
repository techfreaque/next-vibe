/**
 * IMAP Sync API Route Handler
 * Handles POST requests for triggering IMAP synchronization
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import definitions from "./definition";
import { imapSyncRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      imapSyncRepository.startSync(data, user, locale, logger),
  },
});
