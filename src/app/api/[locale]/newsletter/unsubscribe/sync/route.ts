/**
 * Newsletter Unsubscribe Sync Route Handler
 * Called by cron to sync lead statuses for newsletter unsubscribes
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
