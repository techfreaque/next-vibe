/**
 * POS Order Remove Payment API Route Handler
 */
import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { PosOrderRemovePaymentRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      PosOrderRemovePaymentRepository.removePayment(
        data,
        urlPathParams.orderId,
        user.id,
        logger,
        locale,
      ),
  },
});
