/**
 * TakeSnapshot Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import takeSnapshotEndpoints from "./definition";
import { executeTakeSnapshot, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: takeSnapshotEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return executeTakeSnapshot(
        {
          toolName: "take-snapshot",
          args: filterUndefinedArgs({
            verbose: data.verbose,
            filePath: data.filePath,
          }),
        },
        user,
        logger,
        locale,
      );
    },
  },
});
