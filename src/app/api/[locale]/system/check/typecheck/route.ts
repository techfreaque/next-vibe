/**
 * Run TypeScript type checking Route
 * API route for run typescript type checking
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, platform, t, locale, streamContext }) => {
      const { TypecheckRepository } = await import("./repository");
      return await TypecheckRepository.execute(
        data,
        logger,
        platform,
        t,
        locale,
        undefined,
        streamContext.abortSignal,
      );
    },
  },
});
