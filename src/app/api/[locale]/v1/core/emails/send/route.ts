/**
 * Email Send API Route Handler
 * Demonstrates proper integration with email and SMS communication services
 */

import "server-only";

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import { endpointsHandler } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import definitions from "./definition";
import { emailSendRepository } from "./repository";

/**
 * Email Send Route Handler
 * Showcases optional communication integration patterns:
 * - Primary email sending functionality
 * - Optional SMS notifications
 * - Graceful failure handling for communication errors
 * - Proper service integration through repository pattern
 */
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) => {
      // Use repository for business logic
      // Repository handles:
      // 1. Email sending via email service
      // 2. Optional SMS notifications via SMS service
      // 3. Graceful error handling
      // 4. Proper logging and monitoring
      return await emailSendRepository.sendEmail(data, user, locale, logger);
    },
  },
});
