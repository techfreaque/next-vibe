/**
 * Desktop Scroll Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { DesktopInputRepository } from "../shared/repository";
import scrollEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: scrollEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      DesktopInputRepository.scroll(
        {
          x: data.x,
          y: data.y,
          direction: data.direction,
          amount: data.amount,
        },
        t,
        logger,
      ),
  },
});
