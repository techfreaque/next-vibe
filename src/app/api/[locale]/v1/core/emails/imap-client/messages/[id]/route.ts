/**
 * IMAP Message Detail API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { imapMessagesRepository } from "../repository";
import definitions from "./definition";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: async ({ urlVariables, user, locale, logger }) => {
      const response = await imapMessagesRepository.getMessageById(
        { id: urlVariables.id },
        user,
        locale,
        logger,
      );

      // Wrap the message response to match definition structure
      if (response.success && response.data) {
        return {
          success: true as const,
          data: { message: response.data },
        };
      }

      return response;
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ urlVariables, data, user, locale, logger }) => {
      const response = await imapMessagesRepository.updateMessage(
        { messageId: urlVariables.id, updates: data },
        user,
        locale,
        logger,
      );

      // Wrap the message response to match definition structure
      if (response.success && response.data) {
        return {
          success: true as const,
          data: { message: response.data },
        };
      }

      return response;
    },
  },
});

// Add default export for Next.js API route compatibility
export default { GET, PATCH };
