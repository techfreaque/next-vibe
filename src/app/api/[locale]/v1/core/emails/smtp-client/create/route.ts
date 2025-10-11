/**
 * SMTP Account Create API Route Handler
 * Handles POST requests for creating SMTP accounts with optional communication notifications
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import definitions from "./definition";
import { smtpAccountCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined, // No emails for POST requests
    handler: async ({ data, user, locale, logger }) => {
      // Execute main business logic
      const result = await smtpAccountCreateRepository.createSmtpAccount(
        data,
        user,
        locale,
        logger,
      );

      // Note: Email notifications would require additional user profile data
      // that is not available in the JWT payload

      // Optional: Send SMS notification (example pattern)
      // This would typically be configured per user preference
      /*
      if (result.success && user.phoneNumber && user.preferences?.smsNotifications) {
        try {
          await smsService.sendSms({
            to: user.phoneNumber,
            message: `SMTP account "${data.name}" created successfully.`,
            campaignType: "notification",
          }, user, locale, logger);
        } catch (error) {
          logger.warn("Error sending SMS notification", error);
        }
      }
      */

      return result;
    },
  },
});
