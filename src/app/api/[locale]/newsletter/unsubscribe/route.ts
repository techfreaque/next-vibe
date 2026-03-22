/**
 * Newsletter Unsubscribe API Route
 * POST /api/[locale]/newsletter/unsubscribe
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import {
  adminNewsletterUnsubscribeEmailTemplate,
  newsletterUnsubscribeEmailTemplate,
} from "./email";
import { NewsletterUnsubscribeRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    email: [
      {
        template: newsletterUnsubscribeEmailTemplate,
        ignoreErrors: false,
      },
      {
        template: adminNewsletterUnsubscribeEmailTemplate,
        ignoreErrors: true,
      },
    ],
    handler: ({ data, user, locale, logger, t }) =>
      NewsletterUnsubscribeRepository.unsubscribe(
        data,
        user,
        locale,
        logger,
        t,
      ),
  },
});
