import "server-only";

import { desc, eq, or } from "drizzle-orm";
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
import { scopedTranslation } from "../i18n";
import type {
  ExchangeRateListRequest,
  ExchangeRateListResponse,
} from "./definition";

export class ExchangeRateListRepository {
  static async listRates(
    data: ExchangeRateListRequest,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ExchangeRateListResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const code = data.currency?.trim().toUpperCase();
      const rows = await db
        .select({
          id: exchangeRates.id,
          baseCurrency: exchangeRates.baseCurrency,
          quoteCurrency: exchangeRates.quoteCurrency,
          rate: exchangeRates.rate,
          rateDate: exchangeRates.rateDate,
          source: exchangeRates.source,
        })
        .from(exchangeRates)
        .where(
          code
            ? or(
                eq(exchangeRates.baseCurrency, code),
                eq(exchangeRates.quoteCurrency, code),
              )
            : undefined,
        )
        .orderBy(desc(exchangeRates.rateDate), exchangeRates.quoteCurrency)
        .limit(data.limit ?? 50);

      return success({
        rates: rows,
        latestDate: rows[0]?.rateDate ?? null,
      });
    } catch (error) {
      logger.error("Failed to list exchange rates", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
