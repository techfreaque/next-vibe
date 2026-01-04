/**
 * AI Stream API Route
 * Handles streaming AI chat responses with multi-step tool calling support
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { AiStreamRepository } from "./repository";

/**
 * POST handler for AI streaming
 */
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, t, locale, logger, user, request }) => {
      return await AiStreamRepository.createAiStream({
        data,
        t,
        locale,
        logger,
        user,
        request,
      });
    },
  },
});
