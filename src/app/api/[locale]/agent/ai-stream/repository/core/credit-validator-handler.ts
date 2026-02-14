import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import {
  DEFAULT_INPUT_TOKENS,
  DEFAULT_OUTPUT_TOKENS,
} from "@/app/api/[locale]/agent/models/constants";
import {
  calculateCreditCost,
  type ModelOption,
} from "@/app/api/[locale]/agent/models/models";
import { creditValidator } from "@/app/api/[locale]/credits/validator";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

export class CreditValidatorHandler {
  static async validateCredits(params: {
    userId: string | undefined;
    leadId: string | undefined;
    ipAddress: string | undefined;
    modelInfo: ModelOption;
    locale: CountryLanguage;
    logger: EndpointLogger;
  }): Promise<
    ResponseType<{
      effectiveLeadId: string | undefined;
      modelCost: number;
    }>
  > {
    const { userId, leadId, ipAddress, modelInfo, locale, logger } = params;

    const modelCost = calculateCreditCost(
      modelInfo,
      DEFAULT_INPUT_TOKENS,
      DEFAULT_OUTPUT_TOKENS,
    );
    let validationResult;
    let effectiveLeadId = leadId;

    if (userId) {
      validationResult = await creditValidator.validateUserCredits(
        userId,
        modelInfo.id,
        modelCost,
        logger,
      );
    } else if (leadId) {
      validationResult = await creditValidator.validateLeadCredits(
        leadId,
        modelInfo.id,
        modelCost,
        logger,
      );
    } else if (ipAddress) {
      const leadByIpResult = await creditValidator.validateLeadByIp(
        ipAddress,
        modelInfo.id,
        modelCost,
        locale,
        logger,
      );

      if (!leadByIpResult.success) {
        return fail({
          message:
            "app.api.agent.chat.aiStream.route.errors.creditValidationFailed",
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
        message:
          "app.api.agent.chat.aiStream.route.errors.creditValidationFailed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    if (!validationResult.data.canUseModel) {
      logger.warn("Insufficient credits", {
        userId,
        leadId: effectiveLeadId,
        modelId: modelInfo.id,
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
