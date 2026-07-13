/**
 * Desktop GetFocusedWindow Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import getFocusedWindowEndpoints from "./definition";
import { DesktopWindowRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: getFocusedWindowEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ t, logger }) =>
      DesktopWindowRepository.getFocusedWindow(t, logger),
  },
});
