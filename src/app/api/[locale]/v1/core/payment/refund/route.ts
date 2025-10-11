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
    handler: async ({ data, user, locale, logger }) => {
      const userId = authRepository.requireUserId(user);
      logger.debug("Payment refund API POST request", {
        userId: userId,
        transactionId: data.transactionId,
        amount: data.amount,
      });

      // Delegate to repository for business logic and data access
      return await paymentRepository.createRefund(userId, data, locale, logger);
    },
  },
});
