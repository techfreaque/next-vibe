/**
 * AP Bill Pay Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { BillPayRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, data, user, logger, locale }) =>
      BillPayRepository.payBill(user.id, urlPathParams, data, logger, locale),
  },
});
