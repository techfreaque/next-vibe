/**
 * Fill Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import fillEndpoints, { type FillResponseOutput } from "./definition";
import { executeFill, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: fillEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return executeFill<FillResponseOutput>(
        {
          toolName: "fill",
          args: filterUndefinedArgs({
            uid: data.uid,
            value: data.value,
          }),
        },
        user,
        logger,
        locale,
      );
    },
  },
});
