/**
 * Leads Create API Route Handler
 * Handles POST requests for creating new leads
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
    handler: async ({ data, logger }) => {
      return await leadsRepository.createLead(data, logger);
    },
  },
});
