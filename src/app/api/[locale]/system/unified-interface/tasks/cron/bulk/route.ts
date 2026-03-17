/**
 * Cron Bulk Action Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { endpoints } from "./definition";
import { scopedTranslation } from "./i18n";
import { CronBulkRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) => {
      const { t } = scopedTranslation.scopedT(locale);
      return await CronBulkRepository.executeBulkAction(
        data,
        user,
        locale,
        t,
        logger,
      );
    },
  },
});
