/**
 * Newsletter Unsubscribe API Route
 * POST /api/[locale]/newsletter/unsubscribe
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
