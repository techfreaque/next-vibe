/**
 * IMAP Account Individual API Route Handler
 * Handles GET, PUT, DELETE requests for individual IMAP accounts
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { imapAccountsRepository } from "../repository";
import definitions from "./definition";

export const { GET, PUT, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, locale, logger }) =>
      imapAccountsRepository.getAccountById(
        urlPathParams,
        user,
        locale,
        logger,
      ),
  },
  [Methods.PUT]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, locale, logger }) =>
      imapAccountsRepository.updateAccount(
        { ...data, id: urlPathParams.id },
        user,
        locale,
        logger,
      ),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, user, locale, logger }) =>
      imapAccountsRepository.deleteAccount(urlPathParams, user, locale, logger),
  },
});
