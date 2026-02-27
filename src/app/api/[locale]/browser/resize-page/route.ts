/**
 * ResizePage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { executeResizePage, filterUndefinedArgs } from "../shared/repository";
import resizePageEndpoints, {
  type ResizePageResponseOutput,
} from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: resizePageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      executeResizePage<ResizePageResponseOutput>(
        {
          toolName: BrowserTool.RESIZE_PAGE,
          args: filterUndefinedArgs({
            width: data.width,
            height: data.height,
          }),
        },
        t,
        logger,
      ),
  },
});
