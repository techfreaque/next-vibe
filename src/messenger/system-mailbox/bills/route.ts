import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoint from "./definition";
import { BillMailboxRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      BillMailboxRepository.list(data.companyId, user.id, locale, logger),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      BillMailboxRepository.post(data, user.id, locale, logger),
  },
});
