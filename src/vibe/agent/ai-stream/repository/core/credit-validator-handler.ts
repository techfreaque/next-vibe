import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CreditRepository } from "@/credits/repository";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { creditValidator } from "@/credits/validator";

import {
  DEFAULT_INPUT_TOKENS,
  DEFAULT_OUTPUT_TOKENS,
} from "../../../models/constants";
import { calculateCreditCost } from "../../../models/models";
import type { ChatModelOption } from "../../models";
import type { AiStreamT } from "../../stream/i18n";

export class CreditValidatorHandler {
  static async validateCredits(params: {
    user: JwtPayloadType;
    ipAddress: string | undefined;
    modelInfo: ChatModelOption;
    locale: CountryLanguage;
    logger: EndpointLogger;
    t: AiStreamT;
  }): Promise<
    ResponseType<{
      effectiveLeadId: string;
      modelCost: number;
    }>
  > {
    const { user, ipAddress, modelInfo, locale, logger, t } = params;
    const leadId = user.leadId;
    const { t: creditsT } = creditsScopedTranslation.scopedT(locale);

    const modelCost = calculateCreditCost(
      modelInfo,
      DEFAULT_INPUT_TOKENS,
      DEFAULT_OUTPUT_TOKENS,
    );
    let validationResult;
    let effectiveLeadId = leadId;

    if (!user.isPublic) {
      validationResult = await creditValidator.validateUserCredits(
        user,
        modelInfo.id,
        modelCost,
        logger,
        creditsT,
        locale,
      );
    } else if (leadId) {
      validationResult = await creditValidator.validateLeadCredits(
        leadId,
        modelInfo.id,
        modelCost,
        logger,
        creditsT,
        locale,
      );
    } else if (ipAddress) {
      const leadByIpResult = await creditValidator.validateLeadByIp(
        ipAddress,
        modelInfo.id,
        modelCost,
        locale,
        logger,
        creditsT,
      );

      if (!leadByIpResult.success) {
        return fail({
          message: t("route.errors.creditValidationFailed"),
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
        message: t("route.errors.noIdentifier"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    if (!validationResult.success) {
      return fail({
        message: t("route.errors.creditValidationFailed"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    if (!validationResult.data.canUseModel) {
      logger.warn("Insufficient credits", {
        user,
        modelId: modelInfo.id,
        cost: modelCost,
        balance: validationResult.data.balance,
      });

      return fail({
        message: t("route.errors.insufficientCredits", {
          cost: modelCost.toString(),
          balance: validationResult.data.balance.toString(),
        }),
        errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
      });
    }

    // Public free-tier daily cap: hard gate BEFORE generation. PAYMENT_REQUIRED
    // routes into the same out-of-credits conversion card as an empty wallet.
    const capGate = await CreditRepository.gateFreeTierCap(
      user,
      ipAddress,
      modelCost,
      modelInfo.id,
      logger,
      creditsT,
      locale,
    );
    if (!capGate.success) {
      return fail({
        message: capGate.message,
        errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
      });
    }

    logger.debug("Credit validation passed", {
      user,
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
