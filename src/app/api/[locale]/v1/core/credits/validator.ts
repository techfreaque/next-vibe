/**
 * Credit Validator
 * Validates credit availability before AI requests
 */

import {
  fail,
  success,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { getModelCost } from "@/app/api/[locale]/v1/core/agent/chat/model-access/costs";
import { parseError } from "@/app/api/[locale]/v1/core/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { CountryLanguage } from "@/i18n/core/config";

import { creditRepository } from "./repository";

/**
 * Validation Result Interface
 */
export interface CreditValidationResult {
  hasCredits: boolean;
  cost: number;
  balance: number;
  canUseModel: boolean;
}

/**
 * Credit Validator Interface
 */
export interface CreditValidatorInterface {
  // Validate user has enough credits for model
  validateUserCredits(
    userId: string,
    modelId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditValidationResult>>;

  // Validate lead has enough credits for model
  validateLeadCredits(
    leadId: string,
    modelId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditValidationResult>>;

  // Get or create lead by IP and validate credits
  validateLeadByIp(
    ipAddress: string,
    modelId: string,
    locale: string,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      leadId: string;
      validation: CreditValidationResult;
    }>
  >;
}

/**
 * Credit Validator Implementation
 */
class CreditValidator implements CreditValidatorInterface {
  /**
   * Validate user has enough credits for model
   * Logic:
   * - If user has active subscription → use user credits (subscription credits)
   * - If user has no subscription → use lead credits (linked via user_leads table)
   */
  async validateUserCredits(
    userId: string,
    modelId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditValidationResult>> {
    try {
      const cost = getModelCost(modelId);

      // Use cluster resolver to find canonical lead for user
      const { getCanonicalLeadForUser } = await import(
        "@/app/api/[locale]/v1/core/leads/cluster-resolver"
      );
      const canonicalLeadId = await getCanonicalLeadForUser(userId, logger);

      if (!canonicalLeadId) {
        logger.error("No canonical lead found for user", { userId });
        return fail({
          message: "app.api.v1.core.agent.chat.credits.errors.noLeadFound",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const userLead = { leadId: canonicalLeadId };

      // Use repository method to determine credit source and get balance
      const identifierResult =
        await creditRepository.getCreditIdentifierBySubscription(
          userId,
          userLead.leadId,
          logger,
        );

      if (!identifierResult.success) {
        return fail({
          message: "app.api.v1.core.agent.chat.credits.errors.getBalanceFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: identifierResult,
        });
      }

      const { creditType } = identifierResult.data;

      // Get balance using the repository method
      const balanceResult = await creditRepository.getBalance(
        { leadId: userLead.leadId, userId },
        logger,
      );

      if (!balanceResult.success) {
        return fail({
          message: "app.api.v1.core.agent.chat.credits.errors.getBalanceFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: balanceResult,
        });
      }

      const balance = balanceResult.data.total;
      const hasCredits = balance >= cost;

      logger.info("Validated user credits", {
        userId,
        leadId: userLead.leadId,
        modelId,
        cost,
        balance,
        hasCredits,
        creditType,
      });

      return success({
        hasCredits,
        cost,
        balance,
        canUseModel: hasCredits || cost === 0,
      });
    } catch (error) {
      logger.error("Failed to validate user credits", parseError(error), {
        userId,
        modelId,
      });
      return fail({
        message: "app.api.v1.core.agent.chat.credits.errors.getBalanceFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Validate lead has enough credits for model
   */
  async validateLeadCredits(
    leadId: string,
    modelId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditValidationResult>> {
    try {
      const cost = getModelCost(modelId);

      // Get lead's balance (with monthly rotation)
      const balanceResult = await creditRepository.getLeadBalance(
        leadId,
        logger,
      );
      if (!balanceResult.success) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.credits.errors.getLeadBalanceFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: balanceResult,
        });
      }

      const balance = balanceResult.data;
      const hasCredits = balance >= cost;

      logger.debug("Validated lead credits", {
        leadId,
        modelId,
        cost,
        balance,
        hasCredits,
      });

      return success({
        hasCredits,
        cost,
        balance,
        canUseModel: hasCredits || cost === 0, // Free models always allowed
      });
    } catch (error) {
      logger.error("Failed to validate lead credits", parseError(error), {
        leadId,
        modelId,
      });
      return fail({
        message:
          "app.api.v1.core.agent.chat.credits.errors.getLeadBalanceFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get or create lead by IP and validate credits
   */
  async validateLeadByIp(
    ipAddress: string,
    modelId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      leadId: string;
      validation: CreditValidationResult;
    }>
  > {
    try {
      // Get or create lead
      const leadResult = await creditRepository.getOrCreateLeadByIp(
        ipAddress,
        locale,
        logger,
      );

      if (!leadResult.success) {
        return fail({
          message:
            "app.api.v1.core.agent.chat.credits.errors.getOrCreateLeadFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: leadResult,
        });
      }

      const { leadId, credits } = leadResult.data;

      // Validate credits
      const cost = getModelCost(modelId);
      const hasCredits = credits >= cost;

      logger.debug("Validated lead by IP", {
        ipAddress,
        leadId,
        modelId,
        cost,
        balance: credits,
        hasCredits,
      });

      return success({
        leadId,
        validation: {
          hasCredits,
          cost,
          balance: credits,
          canUseModel: hasCredits || cost === 0,
        },
      });
    } catch (error) {
      logger.error("Failed to validate lead by IP", parseError(error), {
        ipAddress,
        modelId,
      });
      return fail({
        message:
          "app.api.v1.core.agent.chat.credits.errors.getLeadBalanceFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

export const creditValidator = new CreditValidator();
