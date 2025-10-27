/**
 * Import Job Stop Action API Route
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import { importRepository } from "../../../../../import/repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ user, urlPathParams, logger }) => {
      const userId = authRepository.requireUserId(user);
      const { jobId } = urlPathParams;

      const response = await importRepository.performJobAction(
        userId,
        jobId,
        "stop",
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
