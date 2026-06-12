/**
 * Payment Refund API Route
 * Handles refund operations for payments
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { PaymentRepository } from "../repository";
import refundDefinitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: refundDefinitions,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      PaymentRepository.createRefund(user.id, data, locale, logger),
  },
});
