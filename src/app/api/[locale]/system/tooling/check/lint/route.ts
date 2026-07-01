/**
 * Run ESLint Route
 * API route for run eslint
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, platform, locale, streamContext }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).LintRepository.execute(
        data,
        logger,
        platform,
        undefined,
        streamContext.abortSignal,
        locale,
      ),
  },
});
