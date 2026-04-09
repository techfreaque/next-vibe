/**
 * TakeSnapshot Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import takeSnapshotEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: takeSnapshotEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, user, request }) =>
      BrowserSharedRepository.executeTakeSnapshot(
        {
          sessionId:
            request?.headers.get("authorization") ?? user.id ?? user.leadId,
          toolName: BrowserTool.TAKE_SNAPSHOT,
          args: BrowserSharedRepository.filterUndefinedArgs({
            verbose: data.verbose,
            filePath: data.filePath,
          }),
        },
        t,
        logger,
      ),
  },
});
