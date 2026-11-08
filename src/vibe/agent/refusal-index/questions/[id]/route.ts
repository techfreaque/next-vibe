/**
 * Refusal Index - Single Question Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { RefusalQuestionsRepository } from "../repository";
import definitions from "./definition";

export const { PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, logger, locale }) =>
      RefusalQuestionsRepository.update(urlPathParams, data, logger, locale),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, logger, locale }) =>
      RefusalQuestionsRepository.remove(urlPathParams, logger, locale),
  },
});
