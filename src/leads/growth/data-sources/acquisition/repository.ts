import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type {
  DataPoint,
  Resolution,
  TimeRange,
} from "next-vibe/dataflow/shared/fields";
import { fillGaps } from "next-vibe/dataflow/shared/range";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  type AcquisitionFilters,
  AcquisitionSourceFilter,
} from "../../acquisition";
import { AcquisitionRepository } from "../../acquisition-repository";
import type { GrowthT } from "../../i18n";
import type definitions from "./definition";
import type { AcquisitionSeriesRequestOutput } from "./definition";

/** One source type (or all of them) out of a per-source split. */
function sourceSeries(
  rows: ReadonlyArray<{ bucket: string; sourceType: string; value: number }>,
  data: {
    range: TimeRange;
    resolution: Resolution;
    sourceType?: AcquisitionFilters["sourceType"];
  },
): DataPoint[] {
  const all =
    data.sourceType === undefined ||
    data.sourceType === AcquisitionSourceFilter.ALL;
  const totals = new Map<number, number>();
  for (const row of rows) {
    if (all || row.sourceType === data.sourceType) {
      const ts = new Date(row.bucket).getTime();
      totals.set(ts, (totals.get(ts) ?? 0) + Number(row.value));
    }
  }
  return fillGaps(
    [...totals.entries()]
      .toSorted(([a], [b]) => a - b)
      .map(([ts, value]) => ({ timestamp: new Date(ts), value })),
    data.range,
    data.resolution,
  );
}

export class AcquisitionSeriesRepository {
  static async query(
    data: AcquisitionSeriesRequestOutput,
    logger: EndpointLogger,
    t: GrowthT,
  ): Promise<ResponseType<typeof definitions.POST.types.ResponseOutput>> {
    try {
      const currency = data.currency ?? "EUR";
      const textFilters = [
        data.source,
        data.medium,
        data.campaign,
        data.referrerHost,
        data.refCode,
      ].some((value) => value !== undefined && value.trim().length > 0);
      const result = textFilters
        ? await AcquisitionRepository.series({
            ...data,
            filters: data,
            currency,
          })
        : sourceSeries(
            await AcquisitionRepository.seriesBySource({
              ...data,
              currency,
            }),
            data,
          );
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
