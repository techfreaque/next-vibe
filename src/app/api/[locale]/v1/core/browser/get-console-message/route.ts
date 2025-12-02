/**
 * GetConsoleMessage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import getConsoleMessageEndpoints from "./definition";
import { executeGetConsoleMessage, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: getConsoleMessageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return executeGetConsoleMessage(
        {
          toolName: "get-console-message",
          args: filterUndefinedArgs({
            msgid: data.msgid,
          }),
        },
        user,
        logger,
        locale,
      );
    },
  },
});
