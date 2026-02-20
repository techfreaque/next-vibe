/**
 * Messaging Account Edit Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { messagingAccountEditRepository } from "./repository";

export const { GET, PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger }) =>
      messagingAccountEditRepository.getAccount(urlPathParams, user, logger),
  },
  [Methods.PUT]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger }) =>
      messagingAccountEditRepository.updateAccount(
        { ...data, id: urlPathParams.id },
        user,
        logger,
      ),
  },
});
