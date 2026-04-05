/**
 * Fill Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import fillEndpoints, { type FillResponseOutput } from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: fillEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, user, request }) =>
      BrowserSharedRepository.executeFill<FillResponseOutput>(
        {
          sessionId: request?.headers.get("authorization") ?? user.id ?? user.leadId,
          toolName: BrowserTool.FILL,
          args: BrowserSharedRepository.filterUndefinedArgs({
            uid: data.uid,
            value: data.value,
          }),
        },
        t,
        logger,
      ),
  },
});
