/**
 * IMAP Message Detail API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import { imapMessagesRepository } from "../repository";
import definitions from "./definition";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: async ({ urlVariables, user, locale, logger }) => {
      // Convert locale to country part for IMAP repository
      const [, countryPart] = locale.split("-");
      const country =
        (countryPart?.toUpperCase() as import("@/i18n/core/config").Countries) ||
        "GLOBAL";

      return await imapMessagesRepository.getMessageById(
        { id: urlVariables.id },
        user,
        country,
        logger,
      );
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ urlVariables, data, user, locale, logger }) => {
      // Convert locale to country part for IMAP repository
      const [, countryPart] = locale.split("-");
      const country =
        (countryPart?.toUpperCase() as import("@/i18n/core/config").Countries) ||
        "GLOBAL";

      return await imapMessagesRepository.updateMessage(
        { messageId: urlVariables.id, updates: data },
        user,
        country,
        logger,
      );
    },
  },
});

// Add default export for Next.js API route compatibility
export default { GET, PATCH };
