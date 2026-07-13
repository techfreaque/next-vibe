/**
 * Newsletter Unsubscribe Sync Route Handler
 * Called by cron to sync lead statuses for newsletter unsubscribes
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { NewsletterUnsubscribeSyncRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      NewsletterUnsubscribeSyncRepository.sync(data, logger, locale),
  },
});
