/**
 * Import Job Stop Action API Route
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import { importRepository } from "../../../../../import/repository";
import { CsvImportJobAction } from "../../../enum";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ user, urlVariables }) => {
      const userId = authRepository.requireUserId(user);
      const { jobId } = urlVariables;

      return await importRepository.performJobAction(
        userId,
        jobId,
        CsvImportJobAction.STOP,
      );
    },
  },
});
