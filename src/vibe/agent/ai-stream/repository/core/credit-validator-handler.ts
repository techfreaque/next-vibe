import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { TranslatedKeyType } from "next-vibe/core/i18n/core/scoped-translation";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { protectedBalance } from "@/credits/anti-farming/spending";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import { creditValidator } from "@/credits/validator";
import { formatCreditAmount } from "@/products/credit-money";

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
      /** Spendable credits at validation time (free + paid) */
      balance: number;
      dailyLimitMessage?: TranslatedKeyType;
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

    const eligible = await protectedBalance(
      user.id,
      effectiveLeadId,
      modelInfo.id,
      validationResult.data.balance,
      modelCost,
      creditsT,
      locale,
    );
    if (!eligible.success) {
      return eligible;
    }

    if (!validationResult.data.canUseModel) {
      // Keep numeric evidence beside the localized 402 without creating a
      // second error-log entry for the same refusal.
      logger.info("[AiStream] Wallet balance refused generation", {
        walletKind: user.isPublic ? "lead" : "user",
        modelId: modelInfo.id,
        requiredCredits: modelCost,
        spendableCredits: eligible.data,
      });

      return fail({
        message: t("route.errors.insufficientCredits", {
          cost: formatCreditAmount(modelCost, locale),
          balance: formatCreditAmount(validationResult.data.balance, locale),
        }),
        errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
      });
    }

    // Public free-tier daily cap: hard gate BEFORE generation. PAYMENT_REQUIRED
    // routes into the same out-of-credits conversion card as an empty wallet.
    // Free pools also reserve modelCost here, atomically: parallel turns of
    // one guest / IP pool cannot all pass against the same allowance.
    const capGate = await CreditRepository.gateFreeTierCap(
      user,
      ipAddress,
      modelCost,
      modelInfo.id,
      logger,
      creditsT,
      locale,
      eligible.data,
    );
    if (!capGate.success) {
      logger.info("[AiStream] Daily free-tier gate refused generation", {
        walletKind: user.isPublic ? "lead" : "user",
        modelId: modelInfo.id,
        requiredCredits: modelCost,
        spendableCredits: eligible.data,
        gateErrorKey: capGate.errorType.errorKey,
      });
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
        balance: Math.min(
          eligible.data,
          capGate.data?.remaining ?? eligible.data,
        ),
        dailyLimitMessage:
          capGate.data && capGate.data.remaining < eligible.data
            ? capGate.data.limitMessage
            : undefined,
      },
    };
  }
}
