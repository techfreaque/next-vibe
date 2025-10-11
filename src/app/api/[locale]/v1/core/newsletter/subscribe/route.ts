/**
 * Newsletter Subscribe API Route
 * Subscribe to newsletter
 */

import "server-only";

import { endpointsHandler } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
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

      // Send SMS notifications after successful subscription (optional, ignoring errors)
      if (result.success) {
        try {
          await sendWelcomeSms(data, result.data, user, locale, logger);
          await sendAdminNotificationSms(
            data,
            result.data,
            user,
            locale,
            logger,
          );
        } catch (smsError) {
          logger.debug("SMS notifications failed but continuing", { smsError });
        }
      }

      return result;
    },
  },
});
