/**
 * SMTP Account Edit API Route Handler
 * Handles GET and PUT requests for editing SMTP accounts
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { smtpAccountEditRepository } from "./repository";

export const { GET, PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: ({ urlPathParams, user, logger }) =>
      smtpAccountEditRepository.getSmtpAccount(urlPathParams, user, logger),
  },
  [Methods.PUT]: {
    email: undefined, // No emails for PUT requests
    handler: ({ data, urlPathParams, user, logger }) => {
      return smtpAccountEditRepository.updateSmtpAccount(
        { ...data, id: urlPathParams.id },
        user,
        logger,
      );
    },
  },
});
