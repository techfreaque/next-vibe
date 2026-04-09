/**
 * Hover Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import hoverEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: hoverEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, user, request }) =>
      BrowserSharedRepository.executeMCPTool(
        {
          sessionId:
            request?.headers.get("authorization") ?? user.id ?? user.leadId,
          toolName: BrowserTool.HOVER,
          args: BrowserSharedRepository.filterUndefinedArgs({
            uid: data.uid,
          }),
        },
        t,
        logger,
      ),
  },
});
