/**
 * Import Job Retry Action API Route
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { importRepository } from "../../../../../import/repository";
import definitions from "./definition";

/**
 * Export handlers using endpointHandler
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
