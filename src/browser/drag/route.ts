/**
 * Drag Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import dragEndpoints, { type DragResponseOutput } from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: dragEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, toolExecutionContext }) =>
      BrowserSharedRepository.executeDrag<DragResponseOutput>(
        {
          toolName: BrowserTool.DRAG,
          args: BrowserSharedRepository.filterUndefinedArgs({
            from_uid: data.from_uid,
            to_uid: data.to_uid,
          }),
          instanceId: data.instanceId,
        },
        t,
        logger,
        platform,
        toolExecutionContext.threadId,
      ),
  },
});
