/**
 * Click Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeClick, filterUndefinedArgs } from "../shared/repository";
import clickEndpoints, { type ClickResponseOutput } from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: clickEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger }) =>
      executeClick<ClickResponseOutput>(
        {
          toolName: "click",
          args: filterUndefinedArgs({
            uid: data.uid,
            dblClick: data.dblClick,
          }),
        },
        logger,
      ),
  },
});
