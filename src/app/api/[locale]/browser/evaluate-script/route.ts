/**
 * EvaluateScript Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import evaluateScriptEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: evaluateScriptEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      BrowserSharedRepository.executeEvaluateScript(
        {
          toolName: BrowserTool.EVALUATE_SCRIPT,
          args: BrowserSharedRepository.filterUndefinedArgs({
            function: data.function,
            args: data.args ?? undefined,
          }),
        },
        t,
        logger,
      ),
  },
});
