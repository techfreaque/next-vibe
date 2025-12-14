/**
 * ResizePage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeResizePage, filterUndefinedArgs } from "../shared/repository";
import resizePageEndpoints, {
  type ResizePageResponseOutput,
} from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: resizePageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      return executeResizePage<ResizePageResponseOutput>(
        {
          toolName: "resize-page",
          args: filterUndefinedArgs({
            width: data.width,
            height: data.height,
          }),
        },
        logger,
      );
    },
  },
});
