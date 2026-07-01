/**
 * AP Bill Approve Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { BillApproveRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      BillApproveRepository.approveBill(user.id, urlPathParams, logger, locale),
  },
});
