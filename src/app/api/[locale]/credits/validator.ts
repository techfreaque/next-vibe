import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ModelId } from "../agent/models/models";
import { CreditRepository } from "./repository";

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
  validateUserCredits(
    userId: string,
    modelId: string,
    modelCost: number,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditValidationResult>>;

  validateLeadCredits(
    leadId: string,
    modelId: string,
    modelCost: number,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditValidationResult>>;

  validateLeadByIp(
    ipAddress: string,
    modelId: string,
    modelCost: number,
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
  async validateUserCredits(
    userId: string,
    modelId: ModelId,
    modelCost: number,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditValidationResult>> {
    try {
      const balanceResult = await CreditRepository.getBalance(
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
      const hasCredits = balance >= modelCost;

      logger.debug("Validated user credits", {
        userId,
        modelId,
        cost: modelCost,
        balance,
        hasCredits,
      });

      return success({
        hasCredits,
        cost: modelCost,
        balance,
        canUseModel: hasCredits || modelCost === 0,
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

  async validateLeadCredits(
    leadId: string,
    modelId: ModelId,
    modelCost: number,
    logger: EndpointLogger,
  ): Promise<ResponseType<CreditValidationResult>> {
    try {
      const balanceResult = await CreditRepository.getLeadBalance(
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
      const hasCredits = balance >= modelCost;

      logger.debug("Validated lead credits", {
        leadId,
        modelId,
        cost: modelCost,
        balance,
        hasCredits,
      });

      return success({
        hasCredits,
        cost: modelCost,
        balance,
        canUseModel: hasCredits || modelCost === 0,
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

  async validateLeadByIp(
    ipAddress: string,
    modelId: ModelId,
    modelCost: number,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      leadId: string;
      validation: CreditValidationResult;
    }>
  > {
    try {
      const leadResult = await CreditRepository.getOrCreateLeadByIp(
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
      const hasCredits = credits >= modelCost;

      logger.debug("Validated lead by IP", {
        ipAddress,
        leadId,
        modelId,
        cost: modelCost,
        balance: credits,
        hasCredits,
      });

      return success({
        leadId,
        validation: {
          hasCredits,
          cost: modelCost,
          balance: credits,
          canUseModel: hasCredits || modelCost === 0,
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
