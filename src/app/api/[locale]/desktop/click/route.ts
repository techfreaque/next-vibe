/**
 * Desktop Click Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { DesktopInputRepository } from "../shared/repository";
import clickEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: clickEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      DesktopInputRepository.click(
        {
          x: data.x,
          y: data.y,
          button: data.button,
          doubleClick: data.doubleClick,
        },
        t,
        logger,
      ),
  },
});
