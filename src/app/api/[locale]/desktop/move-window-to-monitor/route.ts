/**
 * Desktop MoveWindowToMonitor Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
