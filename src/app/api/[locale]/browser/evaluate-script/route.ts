/**
 * EvaluateScript Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import evaluateScriptEndpoints from "./definition";
import {
  executeEvaluateScript,
  filterUndefinedArgs,
} from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: evaluateScriptEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      return executeEvaluateScript(
        {
          toolName: "evaluate-script",
          args: filterUndefinedArgs({
            function: data.function,
            args: data.args,
          }),
        },
        logger,
      );
    },
  },
});
