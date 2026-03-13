/**
 * Payment Disputes Count — Route
 * Server-only.
 */

import "server-only";

import { success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { queryPaymentsDisputesCount } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data }) => {
      const { resolution, range, lookback } = data;
      const result = await queryPaymentsDisputesCount({
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
