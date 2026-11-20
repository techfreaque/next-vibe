import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { AcquisitionRepository } from "../../acquisition-repository";
import type { GrowthT } from "../../i18n";
import type definitions from "./definition";
import type { AcquisitionSeriesRequestOutput } from "./definition";

export class AcquisitionSeriesRepository {
  static async query(
    data: AcquisitionSeriesRequestOutput,
    logger: EndpointLogger,
    t: GrowthT,
  ): Promise<ResponseType<typeof definitions.POST.types.ResponseOutput>> {
    try {
      const result = await AcquisitionRepository.series({
        ...data,
        filters: data,
        currency: data.currency ?? "EUR",
      });
      return success({
        result,
        meta: {
          actualResolution: data.resolution,
          lookbackUsed: data.lookback ?? 0,
        },
      });
    } catch (error) {
      logger.error("Failed to read acquisition series", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
