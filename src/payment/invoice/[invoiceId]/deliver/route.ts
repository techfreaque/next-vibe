import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { InvoiceDeliverRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      InvoiceDeliverRepository.listLog(user.id, urlPathParams, logger, locale),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      InvoiceDeliverRepository.sendEmail(
        user.id,
        urlPathParams,
        data,
        logger,
        locale,
      ),
  },
});
