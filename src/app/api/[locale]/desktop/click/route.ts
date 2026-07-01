/**
 * Desktop Click Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import clickEndpoints from "./definition";
import { DesktopInputRepository } from "./repository";

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
