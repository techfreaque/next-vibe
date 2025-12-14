/**
 * PressKey Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executePressKey, filterUndefinedArgs } from "../shared/repository";
import pressKeyEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: pressKeyEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      return executePressKey(
        {
          toolName: "press-key",
          args: filterUndefinedArgs({
            key: data.key,
          }),
        },
        logger,
      );
    },
  },
});
