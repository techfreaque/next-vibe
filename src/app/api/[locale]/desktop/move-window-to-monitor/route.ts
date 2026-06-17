/**
 * Desktop MoveWindowToMonitor Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import moveWindowToMonitorEndpoints from "./definition";
import { DesktopWindowRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: moveWindowToMonitorEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      DesktopWindowRepository.moveWindowToMonitor(
        {
          windowId: data.windowId,
          pid: data.pid,
          title: data.title,
          monitorName: data.monitorName,
          monitorIndex: data.monitorIndex,
        },
        t,
        logger,
      ),
  },
});
