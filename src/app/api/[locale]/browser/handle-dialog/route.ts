/**
 * HandleDialog Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import handleDialogEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: handleDialogEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      BrowserSharedRepository.executeMCPTool(
        {
          toolName: BrowserTool.HANDLE_DIALOG,
          args: BrowserSharedRepository.filterUndefinedArgs({
            action: data.action,
            promptText: data.promptText,
          }),
        },
        t,
        logger,
      ),
  },
});
