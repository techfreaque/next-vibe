/**
 * Cron Stats Route
 * API routes for cron task statistics
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/types";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

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
