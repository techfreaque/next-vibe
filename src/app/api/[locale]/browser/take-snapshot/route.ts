/**
 * TakeSnapshot Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import takeSnapshotEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: takeSnapshotEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      BrowserSharedRepository.executeTakeSnapshot(
        {
          toolName: BrowserTool.TAKE_SNAPSHOT,
          args: BrowserSharedRepository.filterUndefinedArgs({
            verbose: data.verbose,
            filePath: data.filePath,
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
