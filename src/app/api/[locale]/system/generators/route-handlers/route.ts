import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { RouteHandlersGeneratorRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async (props) => {
      return await RouteHandlersGeneratorRepository.generateRouteHandlers(
        props.data,
        props.logger,
        props.t,
      );
    },
  },
});
