/**
 * Newsletter Subscribe API Route
 * POST /api/[locale]/newsletter/subscribe
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import {
  adminNewsletterSubscribeEmailTemplate,
  newsletterWelcomeEmailTemplate,
} from "./email";
import { NewsletterSubscribeRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    email: [
      {
        template: newsletterWelcomeEmailTemplate,
        ignoreErrors: false,
      },
      {
        template: adminNewsletterSubscribeEmailTemplate,
        ignoreErrors: false,
      },
    ],
    handler: ({ data, user, locale, logger, t }) =>
      NewsletterSubscribeRepository.subscribe(data, user, locale, logger, t),
  },
});
