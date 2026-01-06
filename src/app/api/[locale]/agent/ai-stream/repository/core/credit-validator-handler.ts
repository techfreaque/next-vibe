/**
 * CreditValidatorHandler - Handles credit validation for AI streaming
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { getModelCost } from "@/app/api/[locale]/agent/models/costs";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import { creditValidator } from "@/app/api/[locale]/credits/validator";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

export class CreditValidatorHandler {
  /**
   * Validate credits for user/lead/IP and return validation result
   */
  static async validateCredits(params: {
    userId: string | undefined;
    leadId: string | undefined;
    ipAddress: string | undefined;
    model: ModelId;
    locale: CountryLanguage;
    logger: EndpointLogger;
  }): Promise<
    ResponseType<{
      effectiveLeadId: string | undefined;
      modelCost: number;
    }>
  > {
    const { userId, leadId, ipAddress, model, locale, logger } = params;

    const modelCost = getModelCost(model);
    let validationResult;
    let effectiveLeadId = leadId;

    if (userId) {
      validationResult = await creditValidator.validateUserCredits(userId, model, logger);
    } else if (leadId) {
      validationResult = await creditValidator.validateLeadCredits(leadId, model, logger);
    } else if (ipAddress) {
      const leadByIpResult = await creditValidator.validateLeadByIp(
        ipAddress,
        model,
        locale,
        logger,
      );

      if (!leadByIpResult.success) {
        return fail({
          message: "app.api.agent.chat.aiStream.route.errors.creditValidationFailed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      effectiveLeadId = leadByIpResult.data.leadId;
      validationResult = {
        success: true,
        data: leadByIpResult.data.validation,
      };
    } else {
      logger.error("No user, lead, or IP address provided");
      return fail({
        message: "app.api.agent.chat.aiStream.route.errors.noIdentifier",
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    if (!validationResult.success) {
      return fail({
        message: "app.api.agent.chat.aiStream.route.errors.creditValidationFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    if (!validationResult.data.canUseModel) {
      logger.warn("Insufficient credits", {
        userId,
        leadId: effectiveLeadId,
        model,
        cost: modelCost,
        balance: validationResult.data.balance,
      });

      return fail({
        message: "app.api.agent.chat.aiStream.route.errors.insufficientCredits",
        errorType: ErrorResponseTypes.FORBIDDEN,
        messageParams: {
          cost: modelCost.toString(),
          balance: validationResult.data.balance.toString(),
        },
      });
    }

    logger.debug("Credit validation passed", {
      userId,
      leadId: effectiveLeadId,
      cost: modelCost,
      balance: validationResult.data.balance,
    });

    return {
      success: true,
      data: {
        effectiveLeadId,
        modelCost,
      },
    };
  }
}
