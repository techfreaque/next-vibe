/**
 * POS Order Refund API Route Handler
 */
import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { PosOrderRefundRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      PosOrderRefundRepository.getRefunds(
        urlPathParams.orderId,
        user.id,
        logger,
        locale,
      ),
  },
  [Methods.POST]: {
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      PosOrderRefundRepository.refundOrder(
        data,
        urlPathParams.orderId,
        user.id,
        logger,
        locale,
      ),
  },
});
