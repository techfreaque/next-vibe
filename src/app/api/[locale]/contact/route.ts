/**
 * Contact API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import contactEndpoints from "./definition";
import { renderCompanyMail, renderPartnerMail } from "./email";
import { ContactRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: contactEndpoints,
  [Methods.POST]: {
    email: [
      {
        render: renderCompanyMail,
        ignoreErrors: false,
      },
      {
        render: renderPartnerMail,
        ignoreErrors: false,
      },
    ],
    handler: ({ data, user, locale, logger }) =>
      ContactRepository.submitContactForm(data, user, locale, logger),
  },
});
