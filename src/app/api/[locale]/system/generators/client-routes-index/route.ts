/**
 * Client Routes Index Generator Route Handler
 */

import { endpointHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/single";

import definitions from "./definition";
import { ClientRoutesIndexGeneratorRepository } from "./repository";

export const { POST, tools } = endpointHandler({
  endpoint: definitions.POST,
  handler: ({ data, logger }) =>
    ClientRoutesIndexGeneratorRepository.generateClientRoutesIndex(
      data,
      logger,
    ),
});
