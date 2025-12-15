/**
 * HandleDialog Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";
import handleDialogEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: handleDialogEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger }) =>
      executeMCPTool(
        {
          toolName: "handle-dialog",
          args: filterUndefinedArgs({
            action: data.action,
            promptText: data.promptText,
          }),
        },
        logger,
      ),
  },
});
