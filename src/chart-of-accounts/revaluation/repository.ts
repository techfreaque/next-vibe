import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { CompanyMemberRole } from "@/companies/enum";
import { CompanyAuthRepository } from "@/companies/repository";

import { scopedTranslation } from "../exchange-rates/i18n";
import type { FxRevaluationRequest, FxRevaluationResponse } from "./definition";
import { runUnrealizedFxRevaluation } from "./engine";

export class FxRevaluationRepository {
  static async revalue(
    userId: string,
    data: FxRevaluationRequest,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FxRevaluationResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    const auth = await CompanyAuthRepository.requireMember(
      userId,
      data.companyId,
      CompanyMemberRole.ACCOUNTANT,
      logger,
      locale,
    );
    if (!auth.success) {
      return auth;
    }

    try {
      const asOfIso = data.asOfDate.toISOString().slice(0, 10);
      const result = await runUnrealizedFxRevaluation({
        companyId: data.companyId,
        asOfDate: asOfIso,
        dryRun: data.dryRun,
        postReversalNextDay: data.postReversalNextDay,
        userId,
        logger,
      });
      if (!result) {
        return fail({
          message: t("errors.notFound.description"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }
      return success({
        functionalCurrency: result.functionalCurrency,
        asOfDateResponse: result.asOfDate,
        dryRunResponse: result.dryRun,
        totalUnrealizedGainLoss: result.totalUnrealizedGainLoss,
        missingRateCurrencies: result.missingRateCurrencies,
        journalEntryId: result.journalEntryId,
        reversalEntryId: result.reversalEntryId,
        items: result.items.map((item) => ({
          accountId: item.accountId,
          accountCode: item.accountCode,
          accountName: item.accountName,
          currency: item.currency,
          foreignBalance: item.foreignBalance,
          carryingFunctional: item.carryingFunctional,
          closingRate: item.closingRate,
          revaluedFunctional: item.revaluedFunctional,
          unrealizedGainLoss: item.unrealizedGainLoss,
        })),
      });
    } catch (error) {
      logger.error("Failed to run FX revaluation", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
