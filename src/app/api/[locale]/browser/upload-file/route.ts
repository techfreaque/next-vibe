/**
 * UploadFile Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeUploadFile, filterUndefinedArgs } from "../shared/repository";
import uploadFileEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: uploadFileEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger }) =>
      executeUploadFile(
        {
          toolName: "upload-file",
          args: filterUndefinedArgs({
            uid: data.uid,
            filePath: data.filePath,
          }),
        },
        logger,
      ),
  },
});
