/**
 * CSV Import API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import { scopedTranslation as importScopedTranslation } from "@/app/api/[locale]/import/i18n";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { leadsImportRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, logger, locale }) => {
      const { t } = importScopedTranslation.scopedT(locale);
      return await leadsImportRepository.importLeadsFromCsv(
        data,
        user,
        logger,
        t,
        locale,
      );
    },
  },
});
