/**
 * Payment Refund API Route
 * Handles refund operations for payments
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import { paymentRepository } from "../repository";
import refundDefinitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: refundDefinitions,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) => {
      logger.debug("Payment refund API POST request", {
        userId: authRepository.requireUserId(user),
        transactionId: data.transactionId,
        amount: data.amount,
      });
      return paymentRepository.createRefund(
        authRepository.requireUserId(user),
        data,
        locale,
        logger,
      );
    },
  },
});
