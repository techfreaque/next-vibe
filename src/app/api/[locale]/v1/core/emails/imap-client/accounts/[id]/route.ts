/**
 * IMAP Account Individual API Route Handler
 * Handles GET, PUT, DELETE requests for individual IMAP accounts
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import { imapAccountsRepository } from "../repository";
import definitions from "./definition";

export const { GET, PUT, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ urlVariables, user, locale, logger }) => {
      return await imapAccountsRepository.getAccountById(
        urlVariables,
        user,
        locale,
        logger,
      );
    },
  },
  [Methods.PUT]: {
    email: undefined,
    handler: async ({ data, urlVariables, user, locale, logger }) => {
      return await imapAccountsRepository.updateAccount(
        { ...data, id: urlVariables.id },
        user,
        locale,
        logger,
      );
    },
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: async ({ urlVariables, user, locale, logger }) => {
      return await imapAccountsRepository.deleteAccount(
        urlVariables,
        user,
        locale,
        logger,
      );
    },
  },
});
