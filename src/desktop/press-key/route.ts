/**
 * Desktop PressKey Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import pressKeyEndpoints from "./definition";
import { DesktopInputRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: pressKeyEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      DesktopInputRepository.pressKey(
        {
          key: data.key,
          repeat: data.repeat,
          delay: data.delay,
          windowId: data.windowId,
          windowTitle: data.windowTitle,
        },
        t,
        logger,
      ),
  },
});
