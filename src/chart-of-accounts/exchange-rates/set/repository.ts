import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { exchangeRates } from "../../db";
import { roundExchangeRate } from "../ecb";
import { scopedTranslation } from "../i18n";
import type {
  ExchangeRateSetRequest,
  ExchangeRateSetResponse,
} from "./definition";

export class ExchangeRateSetRepository {
  static async setManualRate(
    userId: string,
    data: ExchangeRateSetRequest,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ExchangeRateSetResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    if (data.baseCurrency === data.quoteCurrency) {
      return fail({
        message: t("errors.validation.description"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    try {
      const rateDate = data.rateDate.toISOString().slice(0, 10);
      const rounded = roundExchangeRate(data.rate);
      await db
        .insert(exchangeRates)
        .values({
          baseCurrency: data.baseCurrency,
          quoteCurrency: data.quoteCurrency,
          rate: rounded,
          rateDate,
          source: "MANUAL",
          createdByUserId: userId,
        })
        .onConflictDoUpdate({
          target: [
            exchangeRates.baseCurrency,
            exchangeRates.quoteCurrency,
            exchangeRates.rateDate,
            exchangeRates.source,
          ],
          set: { rate: rounded, createdByUserId: userId },
        });
      return success({ saved: true });
    } catch (error) {
      logger.error("Failed to save manual exchange rate", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
