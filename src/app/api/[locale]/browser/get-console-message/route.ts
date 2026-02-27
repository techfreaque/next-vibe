/**
 * GetConsoleMessage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import {
  executeGetConsoleMessage,
  filterUndefinedArgs,
} from "../shared/repository";
import getConsoleMessageEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: getConsoleMessageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      executeGetConsoleMessage(
        {
          toolName: BrowserTool.GET_CONSOLE_MESSAGE,
          args: filterUndefinedArgs({
            msgid: data.msgid,
          }),
        },
        t,
        logger,
      ),
  },
});
