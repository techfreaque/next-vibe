/**
 * TakeSnapshot Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeTakeSnapshot, filterUndefinedArgs } from "../shared/repository";
import takeSnapshotEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: takeSnapshotEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger }) =>
      executeTakeSnapshot(
        {
          toolName: "take-snapshot",
          args: filterUndefinedArgs({
            verbose: data.verbose,
            filePath: data.filePath,
          }),
        },
        logger,
      ),
  },
});
