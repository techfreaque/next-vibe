/**
 * Credit Validator
 * Validates credit availability before AI requests
 */

import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";

import { getModelCost } from "../model-access/costs";
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
   */
  async validateUserCredits(
    userId: string,
    modelId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditValidationResult>> {
    try {
      const cost = getModelCost(modelId);

      // Get user's balance
      const balanceResult = await creditRepository.getBalance(userId);
      if (!balanceResult.success) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.credits.errors.getBalanceFailed",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
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

      return createSuccessResponse({
        hasCredits,
        cost,
        balance,
        canUseModel: hasCredits || cost === 0, // Free models always allowed
      });
    } catch (error) {
      logger.error("Failed to validate user credits", {
        error,
        userId,
        modelId,
      });
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.getBalanceFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
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

      // Get lead's balance
      const balanceResult = await creditRepository.getLeadBalance(leadId);
      if (!balanceResult.success) {
        return createErrorResponse(
          "app.api.v1.core.agent.chat.credits.errors.getLeadBalanceFailed",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      const balance = balanceResult.data;
      const hasCredits = balance >= cost;

      logger.info("Validated lead credits", {
        leadId,
        modelId,
        cost,
        balance,
        hasCredits,
      });

      return createSuccessResponse({
        hasCredits,
        cost,
        balance,
        canUseModel: hasCredits || cost === 0, // Free models always allowed
      });
    } catch (error) {
      logger.error("Failed to validate lead credits", {
        error,
        leadId,
        modelId,
      });
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.getLeadBalanceFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get or create lead by IP and validate credits
   */
  async validateLeadByIp(
    ipAddress: string,
    modelId: string,
    locale: string,
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
        return createErrorResponse(
          "app.api.v1.core.agent.chat.credits.errors.getOrCreateLeadFailed",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      const { leadId, credits } = leadResult.data;

      // Validate credits
      const cost = getModelCost(modelId);
      const hasCredits = credits >= cost;

      logger.info("Validated lead by IP", {
        ipAddress,
        leadId,
        modelId,
        cost,
        balance: credits,
        hasCredits,
      });

      return createSuccessResponse({
        leadId,
        validation: {
          hasCredits,
          cost,
          balance: credits,
          canUseModel: hasCredits || cost === 0,
        },
      });
    } catch (error) {
      logger.error("Failed to validate lead by IP", {
        error,
        ipAddress,
        modelId,
      });
      return createErrorResponse(
        "app.api.v1.core.agent.chat.credits.errors.getLeadBalanceFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

export const creditValidator = new CreditValidator();
