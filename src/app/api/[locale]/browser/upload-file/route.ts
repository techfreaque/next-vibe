/**
 * UploadFile Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { executeUploadFile, filterUndefinedArgs } from "../shared/repository";
import uploadFileEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: uploadFileEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      executeUploadFile(
        {
          toolName: BrowserTool.UPLOAD_FILE,
          args: filterUndefinedArgs({
            uid: data.uid,
            filePath: data.filePath,
          }),
        },
        t,
        logger,
      ),
  },
});
