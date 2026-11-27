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

import { syncEcbDailyRates } from "../ecb";
import { scopedTranslation } from "../i18n";
import type { ExchangeRateSyncResponse } from "./definition";

export class ExchangeRateSyncRepository {
  static async syncFromEcb(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ExchangeRateSyncResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const result = await syncEcbDailyRates(logger);
      if (!result) {
        return fail({
          message: t("errors.network.description"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
      return success(result);
    } catch (error) {
      logger.error("Failed to sync ECB daily rates", parseError(error));
      return fail({
        message: t("errors.network.description"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }
}
