import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { UncensoredConsentRepository } from "./repository";

export const { GET, POST, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ user, logger, t }) =>
      UncensoredConsentRepository.getStatus(user, logger, t),
  },
  [Methods.POST]: {
    // The schema only accepts confirm: true - reaching here IS the confirmation.
    handler: ({ user, logger, t }) =>
      UncensoredConsentRepository.agree(user, logger, t),
  },
  [Methods.DELETE]: {
    handler: ({ user, logger, t }) =>
      UncensoredConsentRepository.withdraw(user, logger, t),
  },
});
