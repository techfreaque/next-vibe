/**
 * Run Oxlint Route
 * API route for run oxlint
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, platform, t, locale, streamContext }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).OxlintRepository.execute(
        data,
        logger,
        platform,
        t,
        streamContext.abortSignal,
        locale,
        undefined,
      ),
  },
});
