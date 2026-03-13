/**
 * Credits Transactions Count — Route
 * Server-only.
 */

import "server-only";

import { success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { queryCreditsTransactionsCount } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data }) => {
      const { resolution, range, lookback } = data;
      const result = await queryCreditsTransactionsCount({
        timeRange: range,
        resolution: resolution,
      });
      return success({
        result,
        meta: {
          actualResolution: resolution,
          lookbackUsed: lookback ?? 0,
        },
      });
    },
  },
});
