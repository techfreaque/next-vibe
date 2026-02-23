/**
 * Login Options API Route Handler
 * GET /api/[locale]/user/public/login/options
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation as loginScopedTranslation } from "../i18n";
import { LoginRepository } from "../repository";
import loginOptionsDefinitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: loginOptionsDefinitions,
  [Methods.GET]: {
    handler: async ({ data, logger, locale }) => {
      const { t } = loginScopedTranslation.scopedT(locale);
      return await LoginRepository.getLoginOptionsFormatted(
        data,
        locale,
        logger,
        t,
      );
    },
  },
});
