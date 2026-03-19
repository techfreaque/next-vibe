/**
 * Login Options API Route Handler
 * GET /api/[locale]/user/public/login/options
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { LoginRepository } from "../repository";
import loginOptionsDefinitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: loginOptionsDefinitions,
  [Methods.GET]: {
    handler: ({ data, logger, locale }) =>
      LoginRepository.getLoginOptionsFormatted(data, locale, logger),
  },
});
