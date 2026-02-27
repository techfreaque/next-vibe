/**
 * TakeSnapshot Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { executeTakeSnapshot, filterUndefinedArgs } from "../shared/repository";
import takeSnapshotEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: takeSnapshotEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      executeTakeSnapshot(
        {
          toolName: BrowserTool.TAKE_SNAPSHOT,
          args: filterUndefinedArgs({
            verbose: data.verbose,
            filePath: data.filePath,
          }),
        },
        t,
        logger,
      ),
  },
});
