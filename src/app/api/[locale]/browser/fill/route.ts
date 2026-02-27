/**
 * Fill Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { executeFill, filterUndefinedArgs } from "../shared/repository";
import fillEndpoints, { type FillResponseOutput } from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: fillEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      executeFill<FillResponseOutput>(
        {
          toolName: BrowserTool.FILL,
          args: filterUndefinedArgs({
            uid: data.uid,
            value: data.value,
          }),
        },
        t,
        logger,
      ),
  },
});
