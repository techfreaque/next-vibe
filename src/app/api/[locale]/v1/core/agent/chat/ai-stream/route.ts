/**
 * AI Stream API Route
 * Handles streaming AI chat responses using OpenAI GPT-4o and Uncensored.ai
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { createAiStream } from "./repository";

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
      // Extract userId from user object
      const userId = user.isPublic ? undefined : user.id;

      // Extract leadId from user object (if available)
      const leadId =
        user.isPublic && "leadId" in user && typeof user.leadId === "string"
          ? user.leadId
          : undefined;

      // Extract IP address from request headers
      const ipAddress =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        undefined;

      return await createAiStream({
        data,
        t,
        locale,
        logger,
        userId,
        leadId,
        ipAddress,
      });
    },
  },
});
