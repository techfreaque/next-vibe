/**
 * Endpoint Generator Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { endpointGeneratorRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async (props) => {
      return await endpointGeneratorRepository.generateEndpoint(
        props.data,
        props.logger,
      );
    },
  },
});
