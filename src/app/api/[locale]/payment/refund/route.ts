/**
 * Payment Refund API Route
 * Handles refund operations for payments
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { PaymentRepository } from "../repository";
import refundDefinitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: refundDefinitions,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      PaymentRepository.createRefund(user.id, data, locale, logger),
  },
});
