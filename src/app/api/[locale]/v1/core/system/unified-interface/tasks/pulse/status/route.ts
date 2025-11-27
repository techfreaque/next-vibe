/**
 * Pulse Status API Route Handler
 * Migrated from side-tasks-old/cron/pulse/route.ts
 * Handles GET requests for pulse health status
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import pulseStatusEndpoint from "./definition";
import { pulseHealthRepository } from "../repository";

export const { GET, tools } = endpointsHandler({
  endpoint: pulseStatusEndpoint,
  [Methods.GET]: {
    handler: async ({ logger }) => {
      const healthResponse =
        await pulseHealthRepository.getCurrentHealth(logger);

      if (!healthResponse.success || !healthResponse.data) {
        return {
          success: true,
          data: {
            status: "UNKNOWN",
            lastPulseAt: null,
            successRate: null,
            totalExecutions: 0,
          },
        };
      }

      const health = healthResponse.data;
      return {
        success: true,
        data: {
          status: health.status,
          lastPulseAt: health.lastPulseAt?.toISOString() ?? null,
          successRate: health.successRate,
          totalExecutions: health.totalExecutions,
        },
      };
    },
  },
});
