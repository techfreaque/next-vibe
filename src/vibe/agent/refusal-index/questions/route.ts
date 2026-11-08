/**
 * Refusal Index - Questions Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { RefusalQuestionsRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      RefusalQuestionsRepository.list(data, logger, locale),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, locale }) =>
      RefusalQuestionsRepository.create(data, logger, locale),
  },
});
