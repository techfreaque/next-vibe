/**
 * SelectPage Tool - Route Handler
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import selectPageEndpoints, {
  type SelectPageResponseOutput,
} from "./definition";
import { executeSelectPage, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: selectPageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({
      data,
      user,
      locale,
      logger,
    }): Promise<ResponseType<SelectPageResponseOutput>> => {
      return executeSelectPage(
        {
          toolName: "select-page",
          args: filterUndefinedArgs({
            pageIdx: data.pageIdx,
          }),
        },
        user,
        logger,
        locale,
      ) as Promise<ResponseType<SelectPageResponseOutput>>;
    },
  },
});
