import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { EstimatePdfRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      EstimatePdfRepository.getPdf(user.id, urlPathParams, logger, locale),
  },
});
