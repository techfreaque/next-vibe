/**
 * SMTP Accounts List API Route Handler
 * Handles GET requests for listing SMTP accounts with filtering and pagination
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import definitions from "./definition";
import { smtpAccountsListRepository } from "./repository";

/**
 * Export handlers using endpointHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: async ({ data, user, locale, logger }) => {
      return await smtpAccountsListRepository.listSmtpAccounts(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
