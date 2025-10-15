/**
 * Payment Refund API Route
 * Handles refund operations for payments
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
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
