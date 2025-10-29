import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "../../types/logger";

/**
 * Message ID prefix for credit operations
 */
const MESSAGE_ID_PREFIX = "msg_" as const;

export interface CreditBalance {
  total: number;
  expiring: number;
  permanent: number;
  free: number;
  expiresAt: string | null;
}

export interface CreditIdentifier {
  leadId: string;
  userId?: string;
}

export enum CreditType {
  USER_SUBSCRIPTION = "user_subscription",
  LEAD_FREE = "lead_free",
}

export interface CreditDeductionResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export abstract class BaseCreditHandler {
  abstract getBalance(
    identifier: CreditIdentifier,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditBalance>>;

  abstract deductCredits(
    identifier: CreditIdentifier,
    amount: number,
    modelId: string,
    messageId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;

  abstract addCredits(
    identifier: CreditIdentifier,
    amount: number,
    type: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>>;

  async hasSufficientCredits(
    identifier: CreditIdentifier,
    required: number,
    logger: EndpointLogger,
  ): Promise<boolean> {
    if (!identifier.leadId) {
      logger.error("Credit check requires leadId");
      return false;
    }
    const balanceResult = await this.getBalance(identifier, logger);
    if (!balanceResult.success) {
      return false;
    }
    return balanceResult.data.total >= required;
  }

  async deductCreditsWithValidation(
    identifier: CreditIdentifier,
    amount: number,
    modelId: string,
    logger: EndpointLogger,
  ): Promise<CreditDeductionResult> {
    if (!identifier.leadId) {
      logger.error("Credit deduction requires leadId");
      return {
        success: false,
        error:
          "app.api.v1.core.system.unifiedUi.shared.credits.errors.missingLeadId",
      };
    }

    const hasSufficient = await this.hasSufficientCredits(
      identifier,
      amount,
      logger,
    );
    if (!hasSufficient) {
      return {
        success: false,
        error:
          "app.api.v1.core.system.unifiedUi.shared.credits.errors.insufficientCredits",
      };
    }

    const messageId = this.generateMessageId();
    const result = await this.deductCredits(
      identifier,
      amount,
      modelId,
      messageId,
      logger,
    );
    if (!result.success) {
      return {
        success: false,
        error:
          "app.api.v1.core.system.unifiedUi.shared.credits.errors.deductionFailed",
      };
    }
    return { success: true, messageId };
  }

  protected generateMessageId(): string {
    return `${MESSAGE_ID_PREFIX}${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  protected getCreditIdentifier(user: {
    id?: string;
    leadId?: string;
    isPublic: boolean;
  }): CreditIdentifier | null {
    if (!user.leadId) {
      return null;
    }
    return {
      leadId: user.leadId,
      userId: user.isPublic ? undefined : user.id,
    };
  }

  protected createIdentifier(
    leadId: string,
    userId?: string,
  ): CreditIdentifier | null {
    if (!leadId) {
      return null;
    }
    return { leadId, userId };
  }
}
