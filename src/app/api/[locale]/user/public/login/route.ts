/**
 * Login Route Handler
 * Production-ready route handler following new pattern
 */

import "server-only";

import { scopedTranslation as leadsScopedTranslation } from "@/app/api/[locale]/leads/i18n";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";

import endpoints from "./definition";
import { LoginRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, request, logger, platform, locale, t }) =>
      LoginRepository.login(
        data,
        user,
        locale,
        request,
        logger,
        platform,
        t,
        leadsScopedTranslation.scopedT(locale).t,
      ),
  },
});
