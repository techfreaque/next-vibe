/**
 * Contact API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import contactEndpoints from "./definition";
import { renderCompanyMail, renderPartnerMail } from "./email";
import { contactRepository } from "./repository";
import { sendAdminNotificationSms, sendConfirmationSms } from "./sms";

export const { POST, tools } = endpointsHandler({
  endpoint: contactEndpoints,
  [Methods.POST]: {
    email: [
      {
        render: renderCompanyMail,
        ignoreErrors: false,
      },
      {
        render: renderPartnerMail,
        ignoreErrors: false,
      },
    ],
    handler: async ({ data, user, locale, logger }) => {
      // Execute main business logic
      const result = await contactRepository.submitContactForm(
        data,
        user,
        logger,
      );

      // Send optional SMS notifications (non-blocking)
      if (result.success) {
        // Send admin notification SMS (non-blocking)
        sendAdminNotificationSms(data, user, locale, logger).catch(
          (smsError) => {
            logger.warn("app.api.contact.route.sms.admin.failed", {
              error:
                smsError instanceof Error ? smsError.message : String(smsError),
              contactEmail: data.email,
            });
          },
        );

        // Send confirmation SMS to user (non-blocking)
        sendConfirmationSms(data, user, locale, logger).catch((smsError) => {
          logger.warn("app.api.contact.route.sms.confirmation.failed", {
            error:
              smsError instanceof Error ? smsError.message : String(smsError),
            contactEmail: data.email,
            userId: user?.id,
          });
        });
      }

      return result;
    },
  },
});
