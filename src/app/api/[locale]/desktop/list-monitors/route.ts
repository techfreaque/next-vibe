/**
 * Desktop ListMonitors Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
