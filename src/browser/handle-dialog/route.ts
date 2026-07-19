/**
 * HandleDialog Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import handleDialogEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: handleDialogEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, toolExecutionContext }) =>
      BrowserSharedRepository.executeMCPTool(
        {
          toolName: BrowserTool.HANDLE_DIALOG,
          args: BrowserSharedRepository.filterUndefinedArgs({
            action: data.action,
            promptText: data.promptText,
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
