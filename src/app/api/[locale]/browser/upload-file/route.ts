/**
 * UploadFile Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import uploadFileEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: uploadFileEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, user, request }) =>
      BrowserSharedRepository.executeUploadFile(
        {
          sessionId:
            request?.headers.get("authorization") ?? user.id ?? user.leadId,
          toolName: BrowserTool.UPLOAD_FILE,
          args: BrowserSharedRepository.filterUndefinedArgs({
            uid: data.uid,
            filePath: data.filePath,
          }),
        },
        t,
        logger,
      ),
  },
});
