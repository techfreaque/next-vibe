/**
 * Fill Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeFill, filterUndefinedArgs } from "../shared/repository";
import fillEndpoints, { type FillResponseOutput } from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: fillEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      return executeFill<FillResponseOutput>(
        {
          toolName: "fill",
          args: filterUndefinedArgs({
            uid: data.uid,
            value: data.value,
          }),
        },
        logger,
      );
    },
  },
});
