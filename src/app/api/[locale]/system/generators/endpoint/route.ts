/**
 * Endpoint Generator Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";

export const { tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async (props) => {
      const { EndpointGeneratorRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return EndpointGeneratorRepository.generateEndpoint(
        props.data,
        props.logger,
        props.t,
      );
    },
  },
});
