/**
 * Desktop ListMonitors Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import listMonitorsEndpoints from "./definition";
import { DesktopListMonitorsRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: listMonitorsEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ t, logger }) =>
      DesktopListMonitorsRepository.listMonitors(t, logger),
  },
});
