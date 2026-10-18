/**
 * EvaluateScript Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import evaluateScriptEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: evaluateScriptEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, toolExecutionContext }) =>
      BrowserSharedRepository.executeEvaluateScript(
        {
          toolName: BrowserTool.EVALUATE_SCRIPT,
          args: BrowserSharedRepository.filterUndefinedArgs({
            function: data.function,
            // chrome-devtools-mcp takes plain uid strings, not { uid } objects.
            args: data.args?.map((arg) => arg.uid),
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
