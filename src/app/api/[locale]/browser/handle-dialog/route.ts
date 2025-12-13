/**
 * HandleDialog Tool - Route Handler
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import handleDialogEndpoints, {
  type HandleDialogResponseOutput,
} from "./definition";
import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: handleDialogEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({
      data,
      logger,
    }): Promise<ResponseType<HandleDialogResponseOutput>> => {
      return executeMCPTool(
        {
          toolName: "handle-dialog",
          args: filterUndefinedArgs({
            action: data.action,
            promptText: data.promptText,
          }),
        },
        logger,
      );
    },
  },
});
