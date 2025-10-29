/**
 * SMTP Accounts List API Route Handler
 * Handles GET requests for listing SMTP accounts with filtering and pagination
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { smtpAccountsListRepository } from "./repository";

/**
 * Export handlers using endpointsHandlerr
 */
export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: ({ data, user, locale, logger }) =>
      smtpAccountsListRepository.listSmtpAccounts(data, user, locale, logger),
  },
});
