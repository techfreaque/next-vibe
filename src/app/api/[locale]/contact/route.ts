/**
 * Contact API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import contactEndpoints from "./definition";
import {
  adminContactFormEmailTemplate,
  contactFormEmailTemplate,
} from "./email";
import { ContactRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: contactEndpoints,
  [Methods.POST]: {
    email: [
      {
        template: contactFormEmailTemplate,
        ignoreErrors: false,
      },
      {
        template: adminContactFormEmailTemplate,
        ignoreErrors: false,
      },
    ],
    handler: ({ data, user, locale, logger, t }) =>
      ContactRepository.submitContactForm(data, user, locale, logger, t),
  },
});
