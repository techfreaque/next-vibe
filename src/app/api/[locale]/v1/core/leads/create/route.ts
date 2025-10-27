/**
 * Leads Create API Route Handler
 * Handles POST requests for creating new leads
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import { leadsRepository } from "../repository";
import definitions from "./definition";
import { renderAdminNotificationMail, renderWelcomeMail } from "./email";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: [
      {
        render: renderWelcomeMail,
        ignoreErrors: true, // Don't fail lead creation if welcome email fails
      },
      {
        render: renderAdminNotificationMail,
        ignoreErrors: true, // Don't fail lead creation if admin notification fails
      },
    ],
    handler: async ({ data, user, locale, logger }) => {
      return await leadsRepository.createLead(data, user, locale, logger);
    },
  },
});
