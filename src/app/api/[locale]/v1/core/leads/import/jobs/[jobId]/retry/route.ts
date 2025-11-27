/**
 * Import Job Retry Action API Route
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { importRepository } from "../../../../../import/repository";
import definitions from "./definition";

/**
 * Export handlers using endpointsHandler
 */
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ user, urlPathParams, logger }) => {
      const { jobId } = urlPathParams;

      const response = await importRepository.performJobAction(
        user.id,
        jobId,
        "retry",
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
