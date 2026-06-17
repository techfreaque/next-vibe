/**
 * HandleDialog Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import handleDialogEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: handleDialogEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
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
        streamContext.threadId,
      ),
  },
});
