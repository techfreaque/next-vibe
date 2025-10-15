/**
 * Newsletter Unsubscribe API Route
 * Unsubscribe from newsletter
 */

import "server-only";

import { endpointsHandler } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "../../system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import endpoints from "./definition";
import {
  renderAdminUnsubscribeNotificationMail,
  renderUnsubscribeConfirmationMail,
} from "./email";
import { newsletterUnsubscribeRepository as repository } from "./repository";
import { sendAdminNotificationSms, sendConfirmationSms } from "./sms";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    email: [
      {
        render: renderUnsubscribeConfirmationMail,
        ignoreErrors: false,
      },
      {
        render: renderAdminUnsubscribeNotificationMail,
        ignoreErrors: true, // Don't fail unsubscribe if admin notification fails
      },
    ],
    handler: async ({ data, user, locale, logger }) => {
      const result = await repository.unsubscribe(data, user, locale, logger);

      // Send SMS notifications after successful unsubscription (fire-and-forget)
      if (result.success) {
        sendConfirmationSms(data, result.data, user, locale, logger).catch(
          (smsError: Error) =>
            logger.debug("Confirmation SMS failed but continuing", {
              smsError,
            }),
        );
        sendAdminNotificationSms(data, result.data, user, locale, logger).catch(
          (smsError: Error) =>
            logger.debug("Admin SMS failed but continuing", { smsError }),
        );
      }
      return result;
    },
  },
});
