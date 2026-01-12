/**
 * Vote Message Route Handler
 * Handles POST requests for voting on messages
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { voteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, data, user, locale, logger }) =>
      voteRepository.voteMessage(urlPathParams, data, user, locale, logger),
  },
});
