/**
 * IMAP Message Sync API Route Handler
 * Handles POST requests for syncing IMAP messages
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import { imapMessagesRepository } from "../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointHandler
 */
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      // Convert locale to country part for IMAP repository
      const [, countryPart] = locale.split("-");
      const country =
        (countryPart?.toUpperCase() as import("@/i18n/core/config").Countries) ||
        "GLOBAL";

      return await imapMessagesRepository.syncMessages(
        data,
        user,
        country,
        logger,
      );
    },
  },
});
