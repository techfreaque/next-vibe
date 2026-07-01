/**
 * GetConsoleMessage Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import getConsoleMessageEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: getConsoleMessageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      BrowserSharedRepository.executeGetConsoleMessage(
        {
          toolName: BrowserTool.GET_CONSOLE_MESSAGE,
          args: BrowserSharedRepository.filterUndefinedArgs({
            msgid: data.msgid,
          }),
          instanceId: data.instanceId,
        },
        t,
        logger,
        platform,
        streamContext.threadId,
      ),
  },
});
