/**
 * GetConsoleMessage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import getConsoleMessageEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: getConsoleMessageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      BrowserSharedRepository.executeGetConsoleMessage(
        {
          toolName: BrowserTool.GET_CONSOLE_MESSAGE,
          args: BrowserSharedRepository.filterUndefinedArgs({
            msgid: data.msgid,
          }),
        },
        t,
        logger,
      ),
  },
});
