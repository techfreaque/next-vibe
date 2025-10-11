/**
 * Import Job Management API Routes
 * Individual job operations (update, delete)
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import { importRepository } from "../../../../import/repository";
import definitions from "./definition";

/**
 * Export handlers using endpointHandler
 */
export const { PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    handler: async ({ user, data, urlVariables }) => {
      const userId = authRepository.requireUserId(user);
      const { jobId } = urlVariables;
      const updates = data;

      return await importRepository.updateImportJob(userId, {
        jobId,
        ...updates,
      });
    },
  },
  [Methods.DELETE]: {
    handler: async ({ user, urlVariables }) => {
      const userId = authRepository.requireUserId(user);
      const { jobId } = urlVariables;

      return await importRepository.deleteImportJob(userId, jobId);
    },
  },
});
