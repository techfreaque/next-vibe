/**
 * UploadFile Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import uploadFileEndpoints from "./definition";
import { executeUploadFile, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: uploadFileEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return executeUploadFile(
        {
          toolName: "upload-file",
          args: filterUndefinedArgs({
            uid: data.uid,
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
