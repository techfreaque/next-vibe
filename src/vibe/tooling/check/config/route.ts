/**
 * Config Create Route Handler
 * Handles POST requests for creating check.config.ts
 */

import "server-only";

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";
import configCreateEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: configCreateEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, platform }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */
          "./repository"
        )
      ).ConfigCreateRepository.execute(data, logger, platform),
  },
});
