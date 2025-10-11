/**
 * Template Notifications API Routes
 * Handles template notification operations
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import {
  renderAdminNotificationMail,
  renderUserNotificationMail,
} from "./email";
import { templateNotificationsRepository } from "./repository";
import { renderAdminSmsNotification, renderUserSmsNotification } from "./sms";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: {
      afterHandlerEmails: [
        {
          render: renderAdminNotificationMail,
          ignoreErrors: true, // Don't fail if admin email fails
        },
        {
          render: renderUserNotificationMail,
          ignoreErrors: false, // Fail if user email fails
        },
      ],
    },
    sms: {
      afterHandlerSms: [
        {
          render: renderAdminSmsNotification,
          ignoreErrors: true, // Don't fail if admin SMS fails
        },
        {
          render: renderUserSmsNotification,
          ignoreErrors: true, // Don't fail if user SMS fails
        },
      ],
    },
    handler: async ({ data, auth, logger }) => {
      return await templateNotificationsRepository.sendNotifications(
        data,
        auth,
        logger,
      );
    },
  },
});
