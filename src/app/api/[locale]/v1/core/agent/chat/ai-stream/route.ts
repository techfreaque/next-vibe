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
      // Log user object for debugging
      logger.info(
        "app.api.v1.core.agent.chat.aiStream.route.debug.userObject",
        {
          isPublic: user.isPublic,
          hasId: "id" in user,
          id: "id" in user ? user.id : undefined,
          hasLeadId: "leadId" in user,
          leadId: "leadId" in user ? user.leadId : undefined,
        },
      );

      // Extract userId and leadId from user object
      // For authenticated users: user.isPublic = false, user.id exists, user.leadId exists
      // For public users: user.isPublic = true, user.id doesn't exist, user.leadId exists
      const userId = !user.isPublic && "id" in user ? user.id : undefined;
      const leadId =
        "leadId" in user && typeof user.leadId === "string"
          ? user.leadId
          : undefined;

      logger.info("app.api.v1.core.agent.chat.aiStream.route.debug.extracted", {
        userId,
        leadId,
      });

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
