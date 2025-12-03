/**
 * Drag Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import dragEndpoints, { type DragResponseOutput } from "./definition";
import { executeDrag, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: dragEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return executeDrag<DragResponseOutput>(
        {
          toolName: "drag",
          args: filterUndefinedArgs({
            from_uid: data.from_uid,
            to_uid: data.to_uid,
          }),
        },
        user,
        logger,
        locale,
      );
    },
  },
});
