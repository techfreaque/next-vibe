/**
 * Refusal Index - Run detail Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { RefusalRunsRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, urlPathParams, logger, locale }) =>
      RefusalRunsRepository.detail(data, urlPathParams, logger, locale),
  },
});
