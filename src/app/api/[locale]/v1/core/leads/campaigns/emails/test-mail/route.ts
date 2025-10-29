/**
 * Test Email API Route Handler
 * Handles POST requests for sending test emails with custom lead data
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { testEmailRepository } from "./repository";

/**
 * Export handlers using endpointsHandler
 */
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, logger }) => {
      return await testEmailRepository.sendTestEmail(data, user, logger);
    },
  },
});
