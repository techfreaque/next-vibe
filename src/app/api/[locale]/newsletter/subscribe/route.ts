/**
 * Newsletter Subscribe API Route
 * Subscribe to newsletter
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { renderAdminNotificationMail, renderWelcomeMail } from "./email";
import { newsletterSubscribeRepository as repository } from "./repository";
import { sendAdminNotificationSms, sendWelcomeSms } from "./sms";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    email: [
      {
        render: renderWelcomeMail,
        ignoreErrors: false,
      },
      {
        render: renderAdminNotificationMail,
        ignoreErrors: false,
      },
    ],
    handler: async ({ data, user, locale, logger }) => {
      const result = await repository.subscribe(data, user, locale, logger);

      // Send SMS notifications after successful subscription (fire-and-forget)
      if (result.success) {
        sendWelcomeSms(data, user, locale, logger).catch(
          (smsError: Error) =>
            logger.debug("Welcome SMS failed but continuing", { smsError }),
        );
        sendAdminNotificationSms(data, user, locale, logger).catch(
          (smsError: Error) =>
            logger.debug("Admin SMS failed but continuing", { smsError }),
        );
      }
      return result;
    },
  },
});
