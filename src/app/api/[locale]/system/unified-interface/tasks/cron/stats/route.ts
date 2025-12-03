/**
 * Cron Stats Route
 * API routes for cron task statistics
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { ApiHandlerProps } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";

import type {
  CronStatsGetRequestOutput,
  CronStatsGetResponseOutput,
} from "./definition";
import definitions from "./definition";
import { cronStatsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        CronStatsGetRequestOutput,
        Record<string, never>,
        typeof definitions.GET.allowedRoles
      >,
    ): Promise<ResponseType<CronStatsGetResponseOutput>> => {
      return await cronStatsRepository.getStats(
        props.data,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
});
