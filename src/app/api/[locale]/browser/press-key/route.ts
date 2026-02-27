/**
 * PressKey Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { executePressKey, filterUndefinedArgs } from "../shared/repository";
import pressKeyEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: pressKeyEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      executePressKey(
        {
          toolName: BrowserTool.PRESS_KEY,
          args: filterUndefinedArgs({
            key: data.key,
          }),
        },
        t,
        logger,
      ),
  },
});
