/**
 * Drag Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import dragEndpoints, { type DragResponseOutput } from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: dragEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      BrowserSharedRepository.executeDrag<DragResponseOutput>(
        {
          toolName: BrowserTool.DRAG,
          args: BrowserSharedRepository.filterUndefinedArgs({
            from_uid: data.from_uid,
            to_uid: data.to_uid,
          }),
        },
        t,
        logger,
      ),
  },
});
