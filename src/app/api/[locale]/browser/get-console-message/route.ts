/**
 * GetConsoleMessage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import {
  executeGetConsoleMessage,
  filterUndefinedArgs,
} from "../shared/repository";
import getConsoleMessageEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: getConsoleMessageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      return executeGetConsoleMessage(
        {
          toolName: "get-console-message",
          args: filterUndefinedArgs({
            msgid: data.msgid,
          }),
        },
        logger,
      );
    },
  },
});
