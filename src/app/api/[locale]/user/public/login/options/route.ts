/**
 * Login Options API Route Handler
 * GET /api/[locale]/user/public/login/options
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";

import { LoginRepository } from "../repository";
import loginOptionsDefinitions from "./definition";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

export const { GET, tools } = endpointsHandler({
  endpoint: loginOptionsDefinitions,
  [Methods.GET]: {
    handler: async ({ data, logger, locale }) =>
      await LoginRepository.getLoginOptionsFormatted(data, locale, logger),
  },
});
