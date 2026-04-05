/**
 * ListPages Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import listPagesEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: listPagesEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ t, logger, user, request }) => {
      return BrowserSharedRepository.executeMCPTool(
        {
          sessionId: request?.headers.get("authorization") ?? user.id ?? user.leadId,
          toolName: BrowserTool.LIST_PAGES,
          args: BrowserSharedRepository.filterUndefinedArgs({}),
        },
        t,
        logger,
      );
    },
  },
});
