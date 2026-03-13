import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { MessengerAccountEditRepository } from "./repository";

export const { GET, PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, t }) =>
      MessengerAccountEditRepository.getAccount(urlPathParams, user, logger, t),
  },
  [Methods.PUT]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, t }) =>
      MessengerAccountEditRepository.updateAccount(
        { ...data, id: urlPathParams.id },
        user,
        logger,
        t,
      ),
  },
});
