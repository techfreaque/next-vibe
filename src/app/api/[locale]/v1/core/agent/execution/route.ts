/**
 * Email Agent Execution API Route Handler
 * Handles POST requests for manually triggering email agent execution
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import definitions from "./definition";
import { emailAgentExecutionRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, logger }) => {
      const userId = authRepository.requireUserId(user);

      // Apply defaults for optional fields
      const executionData = {
        confirmationIds: data.confirmationIds,
        maxActionsPerRun: data.maxActionsPerRun ?? 25,
        enableToolExecution: data.enableToolExecution ?? true,
        enableConfirmationCleanup: data.enableConfirmationCleanup ?? true,
        confirmationExpiryHours: data.confirmationExpiryHours ?? 24,
        dryRun: data.dryRun ?? false,
      };

      return await emailAgentExecutionRepository.triggerExecution(
        executionData,
        logger,
        userId,
      );
    },
  },
});
