/**
 * AI Stream Run Route
 * POST /api/[locale]/agent/ai-stream/run
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { AiStreamRunRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger, t, streamContext }) =>
      AiStreamRunRepository.run(data, user, locale, logger, t, streamContext),
  },
});
