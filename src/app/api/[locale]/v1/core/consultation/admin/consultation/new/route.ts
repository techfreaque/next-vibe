/**
 * Create New Consultation API Route Handler
 * Handles POST requests for creating new consultations with default values
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import {
  adminConsultationInternalEmail,
  adminConsultationPartnerEmail,
} from "./email";
import { consultationAdminNewRepository } from "./repository";

/**
 * Export handlers using endpointHandler
 */
export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: [
      {
        render: adminConsultationInternalEmail,
        ignoreErrors: false,
      },
      {
        render: adminConsultationPartnerEmail,
        ignoreErrors: false,
      },
    ],
    handler: async ({ data, user, locale, logger }) => {
      // Execute main business logic only - emails are handled via the email property
      return await consultationAdminNewRepository.createConsultation(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
