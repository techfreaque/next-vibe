import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { MessengerAccountEditRepository } from "./repository";

export const { GET, PUT, DELETE, tools } = endpointsHandler({
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
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, t }) =>
      MessengerAccountEditRepository.deleteAccount(
        urlPathParams,
        user,
        logger,
        t,
      ),
  },
});
