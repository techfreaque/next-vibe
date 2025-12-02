/**
 * PressKey Tool - Route Handler
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import pressKeyEndpoints, { type PressKeyResponseOutput } from "./definition";
import { executePressKey, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: pressKeyEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }): Promise<ResponseType<PressKeyResponseOutput>> => {
      return executePressKey(
        {
          toolName: "press-key",
          args: filterUndefinedArgs({
            key: data.key,
          }),
        },
        user,
        logger,
        locale,
      ) as Promise<ResponseType<PressKeyResponseOutput>>;
    },
  },
});
