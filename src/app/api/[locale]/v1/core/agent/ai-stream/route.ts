/**
 * AI Stream API Route
 * Handles streaming AI chat responses using OpenAI GPT-4o and Uncensored.ai
 */

import "server-only";

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";

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
