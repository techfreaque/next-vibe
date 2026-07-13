/**
 * Desktop FocusWindow Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import focusWindowEndpoints from "./definition";
import { DesktopWindowRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: focusWindowEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      DesktopWindowRepository.focusWindow(
        { windowId: data.windowId, pid: data.pid, title: data.title },
        t,
        logger,
      ),
  },
});
