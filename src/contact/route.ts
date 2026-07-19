/**
 * Contact API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import contactEndpoints from "./definition";
import {
  adminContactFormEmailTemplate,
  contactFormEmailTemplate,
  ContactRepository,
} from "./repository";

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
