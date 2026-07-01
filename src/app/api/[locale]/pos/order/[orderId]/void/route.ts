/**
 * POS Order Void API Route Handler
 */
import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { PosOrderVoidRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, user, logger, locale }) =>
      PosOrderVoidRepository.voidOrder(data, user.id, logger, locale),
  },
});
