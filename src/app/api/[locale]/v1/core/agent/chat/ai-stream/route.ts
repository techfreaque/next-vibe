/**
 * AI Stream API Route
 * Handles streaming AI chat responses using OpenAI GPT-4o and Uncensored.ai
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { createAiStream, maxDuration } from "./repository";

/**
 * Allow streaming responses up to 30 seconds
 */
export { maxDuration };

/**
 * POST handler for AI streaming
 */
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, t, locale, logger }) =>
      await createAiStream({ data, t, locale, logger }),
  },
});
