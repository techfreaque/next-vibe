/**
 * Build the application Route
 * API route for build the application
 */

import "server-only";

import { endpointsHandler } from "next-vibe/core/route/multi";
import { Methods } from "next-vibe/core/definition/enums";

import buildEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: buildEndpoints,
  [Methods.POST]: {
    handler: async ({ data, locale, logger, t }) =>
      (await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      )).BuildRepository.execute(data, locale, logger, t),
  },
});
