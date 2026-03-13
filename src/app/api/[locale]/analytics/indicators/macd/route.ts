/**
 * Vibe Sense — MACD Route
 * Server-only.
 */

import "server-only";

import { success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { computeMacd } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data }) => {
      const {
        source,
        fastPeriod,
        slowPeriod,
        signalPeriod,
        resolution,
        lookback,
      } = data;
      const { macd, signal, histogram } = computeMacd(
        source,
        fastPeriod,
        slowPeriod,
        signalPeriod,
      );
      return success({
        macd,
        signal,
        histogram,
        meta: {
          actualResolution: resolution ?? "enums.resolution.1d",
          lookbackUsed: lookback ?? 0,
        },
      });
    },
  },
});
