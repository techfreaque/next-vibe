/**
 * Cron Bulk Action Route Handler
 */

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";

import { endpoints } from "./definition";
import { CronBulkRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger, t, toolExecutionContext }) =>
      await CronBulkRepository.executeBulkAction(
        data,
        user,
        locale,
        t,
        logger,
        toolExecutionContext.abortSignal,
      ),
  },
});
