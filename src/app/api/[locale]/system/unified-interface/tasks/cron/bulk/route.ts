/**
 * Cron Bulk Action Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { endpoints } from "./definition";
import { CronBulkRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger, t, streamContext }) =>
      await CronBulkRepository.executeBulkAction(
        data,
        user,
        locale,
        t,
        logger,
        streamContext.abortSignal,
      ),
  },
});
