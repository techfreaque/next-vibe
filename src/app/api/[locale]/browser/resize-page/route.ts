/**
 * ResizePage Tool - Route Handler
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import resizePageEndpoints, {
  type ResizePageResponseOutput,
} from "./definition";
import { executeResizePage, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: resizePageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({
      data,
      user,
      locale,
      logger,
    }): Promise<ResponseType<ResizePageResponseOutput>> => {
      return executeResizePage(
        {
          toolName: "resize-page",
          args: filterUndefinedArgs({
            width: data.width,
            height: data.height,
          }),
        },
        user,
        logger,
        locale,
      ) as Promise<ResponseType<ResizePageResponseOutput>>;
    },
  },
});
