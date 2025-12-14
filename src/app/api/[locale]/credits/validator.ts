/**
 * Credit Validator
 * Validates credit availability before AI requests
 */

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { getModelCost } from "@/app/api/[locale]/agent/chat/model-access/costs";
import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
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
   * - In wallet-based system, each user has ONE wallet
   * - Get user's balance directly from their wallet
   */
  async validateUserCredits(
    userId: string,
    modelId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditValidationResult>> {
    try {
      const cost = getModelCost(modelId);

      // In wallet-based system, we get the user's wallet balance directly
      // No need for canonical lead resolution - each user has their own wallet
      const balanceResult = await creditRepository.getBalance(
        { userId },
        logger,
      );

      if (!balanceResult.success) {
        return fail({
          message: "app.api.agent.chat.credits.errors.getBalanceFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: balanceResult,
        });
      }

      const balance = balanceResult.data.total;
      const hasCredits = balance >= cost;

      logger.info("Validated user credits", {
        userId,
        modelId,
        cost,
        balance,
        hasCredits,
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
        message: "app.api.agent.chat.credits.errors.getBalanceFailed",
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
          message: "app.api.agent.chat.credits.errors.getLeadBalanceFailed",
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
        message: "app.api.agent.chat.credits.errors.getLeadBalanceFailed",
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
          message: "app.api.agent.chat.credits.errors.getOrCreateLeadFailed",
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
        message: "app.api.agent.chat.credits.errors.getLeadBalanceFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

export const creditValidator = new CreditValidator();
