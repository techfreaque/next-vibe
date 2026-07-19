/**
 * IMAP Sync API Route Handler
 * Handles POST requests for triggering IMAP synchronization
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { ImapSyncRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, t, locale }) =>
      ImapSyncRepository.startSync(data, user, logger, t, locale),
  },
});
