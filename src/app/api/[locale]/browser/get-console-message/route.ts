/**
 * GetConsoleMessage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { BrowserTool, BrowserSharedRepository } from "./repository";

import getConsoleMessageEndpoints from "./definition";

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
