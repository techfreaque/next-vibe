/**
 * Generate Key Route Handler
 */

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";
import endpoints from "./definition";
import { GenerateKeyRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ logger, t }) => GenerateKeyRepository.generate(logger, t),
  },
});
