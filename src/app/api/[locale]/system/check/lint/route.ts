/**
 * Run ESLint Route
 * API route for run eslint
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, platform, locale, streamContext }) => {
      const { LintRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return await LintRepository.execute(
        data,
        logger,
        platform,
        undefined,
        streamContext.abortSignal,
        locale,
      );
    },
  },
});
