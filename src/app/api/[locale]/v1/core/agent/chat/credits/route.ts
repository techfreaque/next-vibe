/**
 * Credit Balance API Route Handler
 * /api/v1/core/agent/chat/credits
 */

import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { creditRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ user, logger }) => {
      // Get credit identifier (determines if we use user credits or lead credits)
      const identifierResult = await creditRepository.getCreditIdentifier(
        user.id,
        user.leadId,
        logger,
      );

      if (!identifierResult.success) {
        return identifierResult;
      }

      const { userId, leadId: userLeadId } = identifierResult.data;

      // If user has subscription → return user credits
      if (userId) {
        return await creditRepository.getBalance(userId);
      }

      // If user has no subscription → return lead credits
      if (userLeadId) {
        const leadBalanceResult =
          await creditRepository.getLeadBalance(userLeadId);

        if (!leadBalanceResult.success) {
          return leadBalanceResult;
        }

        const leadBalance = leadBalanceResult.data;

        // Format lead credits to match the expected response format
        return createSuccessResponse({
          total: leadBalance,
          expiring: 0,
          permanent: 0,
          free: leadBalance,
          expiresAt: null,
        });
      }

      // Should never reach here
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.noCreditSource",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    },
  },
});
