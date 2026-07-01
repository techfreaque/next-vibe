/**
 * Desktop TypeText Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import typeTextEndpoints from "./definition";
import { DesktopInputRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: typeTextEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      DesktopInputRepository.typeText(
        {
          text: data.text,
          delay: data.delay,
          windowId: data.windowId,
          windowTitle: data.windowTitle,
        },
        t,
        logger,
      ),
  },
});
