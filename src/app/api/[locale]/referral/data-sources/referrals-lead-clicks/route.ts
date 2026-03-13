/**
 * Referral Lead Clicks — Route
 * Server-only.
 */

import "server-only";

import { success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { queryReferralsLeadClicks } from "./repository";
import { fillGaps } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/range";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data }) => {
      const { resolution, range, lookback } = data;
      const raw = await queryReferralsLeadClicks({
        timeRange: range,
        resolution: resolution,
      });
      const result = fillGaps(raw, range, resolution);
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
