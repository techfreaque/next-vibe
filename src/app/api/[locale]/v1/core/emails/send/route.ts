/**
 * Email Send API Route Handler
 * Demonstrates proper integration with email and SMS communication services
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

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
    email: undefined, // No emails for POST requests
    handler: ({ data, user, locale, logger }) =>
      emailSendRepository.sendEmail(data, user, locale, logger),
  },
});
