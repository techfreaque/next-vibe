/**
 * Client Routes Index Generator Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";

export const { tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).ClientRoutesIndexGeneratorRepository.generateClientRoutesIndex(
        data,
        logger,
        t,
      ),
  },
});
