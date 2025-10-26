/**
 * Import Job Management API Routes
 * Individual job operations (update, delete)
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import { importRepository } from "../../../../import/repository";
import definitions from "./definition";

/**
 * Export handlers using endpointHandler
 */
export const { PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    handler: async ({ user, data, urlPathParams, logger }) => {
      const userId = authRepository.requireUserId(user);
      const { jobId } = urlPathParams;
      const updates = data.settings;

      const response = await importRepository.updateImportJob(
        userId,
        {
          jobId,
          ...updates,
        },
        logger,
      );

      // Wrap response in job object to match definition
      if (response.success) {
        return {
          success: true,
          data: {
            job: {
              info: {
                id: response.data.id,
                fileName: response.data.fileName,
                status: response.data.status,
              },
              progress: {
                totalRows: response.data.totalRows,
                processedRows: response.data.processedRows,
                successfulImports: response.data.successfulImports,
                failedImports: response.data.failedImports,
                duplicateEmails: response.data.duplicateEmails,
              },
              configuration: {
                currentBatchStart: response.data.currentBatchStart,
                batchSize: response.data.batchSize,
                retryCount: response.data.retryCount,
                maxRetries: response.data.maxRetries,
                error: response.data.error || null,
              },
              timestamps: {
                createdAt: response.data.createdAt,
                updatedAt: response.data.updatedAt,
                startedAt: response.data.startedAt,
                completedAt: response.data.completedAt,
              },
            },
          },
        };
      }
      return response;
    },
  },
  [Methods.DELETE]: {
    handler: async ({ user, urlPathParams, logger }) => {
      const userId = authRepository.requireUserId(user);
      const { jobId } = urlPathParams;

      const response = await importRepository.deleteImportJob(
        userId,
        jobId,
        logger,
      );

      // Wrap response in result object to match definition
      if (response.success) {
        return {
          success: true,
          data: { result: response.data },
        };
      }
      return response;
    },
  },
});
