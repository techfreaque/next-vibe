/**
 * Client Routes Index Generator Route Handler
 */

import { endpointsHandler } from "../../unified-interface/shared/endpoints/route/multi";
import { Methods } from "../../unified-interface/shared/types/enums";
import definitions from "./definition";
import { ClientRoutesIndexGeneratorRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, logger }) => {
      return await ClientRoutesIndexGeneratorRepository.generateClientRoutesIndex(
        data,
        logger,
      );
    },
  },
});
