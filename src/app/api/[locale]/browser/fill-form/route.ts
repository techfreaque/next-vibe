/**
 * FillForm Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { BrowserTool, BrowserSharedRepository } from "./repository";

import fillFormEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: fillFormEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      BrowserSharedRepository.executeFillForm(
        {
          toolName: BrowserTool.FILL_FORM,
          args: BrowserSharedRepository.filterUndefinedArgs({
            elements: data.elements,
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
