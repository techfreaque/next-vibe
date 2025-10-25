/**
 * Credit Deduction Utilities
 * Shared logic for deducting credits across agent features
 */

import "server-only";

import { creditRepository } from "../../credits/repository";
import type { EndpointLogger } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "../../user/auth/definition";

/**
 * Credit deduction context
 */
export interface CreditDeductionContext {
  user: JwtPayloadType;
  cost: number;
  feature: string;
  logger: EndpointLogger;
  // eslint-disable-next-line no-restricted-syntax
  metadata?: Record<string, unknown>;
}

/**
 * Credit deduction result
 */
export interface CreditDeductionResult {
  success: boolean;
  messageId?: string;
  creditIdentifier?: string;
}

/**
 * Deduct credits for a feature
 */
export async function deductCredits(
  context: CreditDeductionContext,
): Promise<CreditDeductionResult> {
  const { user, cost, feature, logger } = context;

  // Skip credit deduction for public users or zero cost
  if (user.isPublic || cost <= 0) {
    logger.debug(`Skipping credit deduction`, {
      feature,
      cost,
      isPublic: user.isPublic,
    });
    return { success: true };
  }

  try {
    const creditMessageId = crypto.randomUUID();

    // Determine correct credit identifier based on user type
    let creditIdentifier: { userId?: string; leadId?: string };

    if (!user.isPublic && user.id && user.leadId) {
      const identifierResult = await creditRepository.getCreditIdentifier(
        user.id,
        user.leadId,
        logger,
      );

      if (identifierResult.success && identifierResult.data) {
        if (identifierResult.data.creditType === "USER_SUBSCRIPTION") {
          // User has subscription - deduct from user credits
          creditIdentifier = { userId: user.id };
        } else {
          // User has no subscription - deduct from lead credits
          creditIdentifier = { leadId: user.leadId };
        }
      } else {
        // Fallback to lead credits if we can't determine subscription status
        creditIdentifier = { leadId: user.leadId };
      }
    } else if (user.leadId) {
      creditIdentifier = { leadId: user.leadId };
    } else {
      logger.error("No userId or leadId available for credit deduction");
      return { success: false };
    }

    const deductResult = await creditRepository.deductCredits(
      creditIdentifier,
      cost,
      feature,
      creditMessageId,
    );

    if (!deductResult.success) {
      logger.error(`Failed to deduct credits for ${feature}`, {
        userId: user.isPublic ? undefined : user.id,
        leadId: user.leadId,
        cost,
      });
      return { success: false };
    }

    logger.info(`Credits deducted successfully for ${feature}`, {
      userId: user.isPublic ? undefined : user.id,
      leadId: user.leadId,
      cost,
      messageId: creditMessageId,
    });

    return {
      success: true,
      messageId: creditMessageId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      creditIdentifier: deductResult.creditIdentifier,
    };
    // eslint-disable-next-line no-restricted-syntax
  } catch (error: unknown) {
    logger.error(`Error deducting credits for ${feature}`, {
      error: error instanceof Error ? error.message : String(error),
      userId: user.id,
      cost,
    });
    return { success: false };
  }
}

/**
 * Check if user has enough credits
 */
export async function hasEnoughCredits(
  userId: string,
  requiredCredits: number,
  logger: EndpointLogger,
): Promise<boolean> {
  try {
    const balance = await creditRepository.getBalance(userId);
    return balance >= requiredCredits;
  } catch (error) {
    logger.error("Error checking credit balance", {
      error: error instanceof Error ? error.message : String(error),
      userId,
    });
    return false;
  }
}
