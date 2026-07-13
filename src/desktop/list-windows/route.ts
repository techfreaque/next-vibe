/**
 * Desktop ListWindows Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import listWindowsEndpoints from "./definition";
import { DesktopWindowRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: listWindowsEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ t, logger }) => DesktopWindowRepository.listWindows(t, logger),
  },
});
