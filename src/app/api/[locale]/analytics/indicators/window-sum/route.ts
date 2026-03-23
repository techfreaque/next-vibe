/**
 * Vibe Sense - Window Sum Route
 * Server-only.
 */

import "server-only";

import { success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { WindowSumIndicatorRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data }) => {
      const { source, size, resolution, lookback } = data;
      const result = WindowSumIndicatorRepository.computeWindowSum(
        source,
        size,
      );
      return success({
        result,
        meta: {
          actualResolution: resolution ?? "enums.resolution.1d",
          lookbackUsed: lookback ?? 0,
        },
      });
    },
  },
});
