/**
 * Login Options API Route Handler
 * GET /api/[locale]/user/public/login/options
 */

import "server-only";

import { endpointsHandler } from "next-vibe/core/route/multi";
import { Methods } from "next-vibe/core/definition/enums";

import { LoginRepository } from "../repository";
import loginOptionsDefinitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: loginOptionsDefinitions,
  [Methods.GET]: {
    handler: ({ data, logger, locale }) =>
      LoginRepository.getLoginOptionsFormatted(data, locale, logger),
  },
});
