/**
 * Newsletter Unsubscribe API Route
 * POST /api/[locale]/newsletter/unsubscribe
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import {
  renderAdminUnsubscribeNotificationMail,
  renderUnsubscribeConfirmationMail,
} from "./email";
import { NewsletterUnsubscribeRepository } from "./repository";

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
        ignoreErrors: true,
      },
    ],
    handler: ({ data, user, locale, logger }) =>
      NewsletterUnsubscribeRepository.unsubscribe(data, user, locale, logger),
  },
});
