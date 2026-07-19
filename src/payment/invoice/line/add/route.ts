/**
 * Add Invoice Line Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import lineAddDefinitions from "./definition";
import { InvoiceLineAddRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: lineAddDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      InvoiceLineAddRepository.addLine(user.id, data, logger, locale),
  },
});
