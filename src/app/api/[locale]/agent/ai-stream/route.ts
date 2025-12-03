/**
 * AI Stream API Route
 * Handles streaming AI chat responses with multi-step tool calling support
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { aiStreamRepository } from "./repository";

/**
 * Allow streaming responses up to 30 seconds
 */
export const maxDuration = 30;

/**
 * POST handler for AI streaming
 */
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, t, locale, logger, user, request }) => {
      return await aiStreamRepository.createAiStream({
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
