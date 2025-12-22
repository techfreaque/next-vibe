/**
 * Newsletter Subscribe API Route
 * POST /api/[locale]/newsletter/subscribe
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { renderAdminNotificationMail, renderWelcomeMail } from "./email";
import { NewsletterSubscribeRepository } from "./repository";

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
    handler: ({ data, user, locale, logger }) =>
      NewsletterSubscribeRepository.subscribe(data, user, locale, logger),
  },
});
