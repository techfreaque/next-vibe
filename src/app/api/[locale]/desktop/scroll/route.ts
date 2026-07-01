/**
 * Desktop Scroll Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import scrollEndpoints from "./definition";
import { DesktopInputRepository } from "./repository";

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
