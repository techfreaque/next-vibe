/**
 * NewPage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import newPageEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: newPageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      BrowserSharedRepository.executeMCPTool(
        {
          toolName: BrowserTool.NEW_PAGE,
          args: BrowserSharedRepository.filterUndefinedArgs({
            url: data.url,
            background: data.background,
            isolatedContext: data.isolatedContext,
            timeout: data.timeout,
          }),
        },
        t,
        logger,
      ),
  },
});
