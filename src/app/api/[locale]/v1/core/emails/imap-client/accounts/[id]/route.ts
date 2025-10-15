/**
 * IMAP Account Individual API Route Handler
 * Handles GET, PUT, DELETE requests for individual IMAP accounts
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { imapAccountsRepository } from "../repository";
import definitions from "./definition";

export const { GET, PUT, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlVariables, user, locale, logger }) =>
      imapAccountsRepository.getAccountById(urlVariables, user, locale, logger),
  },
  [Methods.PUT]: {
    email: undefined,
    handler: ({ data, urlVariables, user, locale, logger }) =>
      imapAccountsRepository.updateAccount(
        { ...data, id: urlVariables.id },
        user,
        locale,
        logger,
      ),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlVariables, user, locale, logger }) =>
      imapAccountsRepository.deleteAccount(urlVariables, user, locale, logger),
  },
});
