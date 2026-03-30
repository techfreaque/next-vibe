/**
 * Run Oxlint Route
 * API route for run oxlint
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, platform, t, locale, streamContext }) => {
      const { OxlintRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return await OxlintRepository.execute(
        data,
        logger,
        platform,
        t,
        streamContext.abortSignal,
        locale,
        undefined,
      );
    },
  },
});
