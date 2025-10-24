/**
 * Import Jobs Management API Routes
 * Comprehensive CRUD operations for import jobs
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import { importRepository } from "../../../import/repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, urlVariables, logger }) => {
      const userId = authRepository.requireUserId(user);
      const response = await importRepository.listImportJobs(
        userId,
        urlVariables.filters,
        logger,
      );

      // Wrap response in jobs object to match definition
      if (response.success) {
        return {
          success: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: { jobs: { items: response.data } },
        };
      }
      return response;
    },
  },
});
