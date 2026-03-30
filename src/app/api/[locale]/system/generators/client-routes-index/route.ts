/**
 * Client Routes Index Generator Route Handler
 */

import { endpointsHandler } from "../../unified-interface/shared/endpoints/route/multi";
import { Methods } from "../../unified-interface/shared/types/enums";
import definitions from "./definition";

export const { tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) => {
      const { ClientRoutesIndexGeneratorRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return ClientRoutesIndexGeneratorRepository.generateClientRoutesIndex(
        data,
        logger,
        t,
      );
    },
  },
});
