/**
 * Click Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import clickEndpoints, { type ClickResponseOutput } from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: clickEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, user, request }) =>
      BrowserSharedRepository.executeClick<ClickResponseOutput>(
        {
          sessionId: request?.headers.get("authorization") ?? user.id ?? user.leadId,
          toolName: BrowserTool.CLICK,
          args: BrowserSharedRepository.filterUndefinedArgs({
            uid: data.uid,
            dblClick: data.dblClick,
          }),
        },
        t,
        logger,
      ),
  },
});
