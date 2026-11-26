import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoint from "./definition";
import { BankPrivacyRepository } from "./repository";

export const { GET, PATCH, POST, tools } = endpointsHandler({
  endpoint,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      BankPrivacyRepository.get(data, user.id, locale, logger),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      BankPrivacyRepository.patch(data, user.id, locale, logger),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      BankPrivacyRepository.post(data, user.id, locale, logger),
  },
});
