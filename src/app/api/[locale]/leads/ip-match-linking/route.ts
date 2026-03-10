/**
 * IP Match Linking Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation as leadsScopedTranslation } from "../i18n";
import definitions from "./definition";
import { scopedTranslation } from "./i18n";
import { IpMatchLinkingRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, locale }) => {
      const { t } = scopedTranslation.scopedT(locale);
      const { t: leadsT } = leadsScopedTranslation.scopedT(locale);
      return IpMatchLinkingRepository.run(data, logger, t, leadsT);
    },
  },
});
