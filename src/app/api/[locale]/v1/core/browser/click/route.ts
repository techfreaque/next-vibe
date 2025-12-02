/**
 * Click Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import clickEndpoints, { type ClickResponseOutput } from "./definition";
import { executeClick, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: clickEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return executeClick<ClickResponseOutput>(
        {
          toolName: "click",
          args: filterUndefinedArgs({
            uid: data.uid,
            dblClick: data.dblClick,
          }),
        },
        user,
        logger,
        locale,
      );
    },
  },
});
