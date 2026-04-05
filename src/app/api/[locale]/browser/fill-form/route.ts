/**
 * FillForm Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import fillFormEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: fillFormEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, user, request }) =>
      BrowserSharedRepository.executeFillForm(
        {
          sessionId: request?.headers.get("authorization") ?? user.id ?? user.leadId,
          toolName: BrowserTool.FILL_FORM,
          args: BrowserSharedRepository.filterUndefinedArgs({
            elements: data.elements,
          }),
        },
        t,
        logger,
      ),
  },
});
