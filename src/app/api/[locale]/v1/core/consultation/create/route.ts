/**
 * Create Consultation Route Handler
 * Handles POST requests for creating consultations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import createEndpoints from "./definition";
import { consultationAdminEmail, consultationRequestEmail } from "./email";
import { consultationCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: createEndpoints,
  [Methods.POST]: {
    email: [
      {
        render: consultationRequestEmail,
        ignoreErrors: false,
      },
      {
        render: consultationAdminEmail,
        ignoreErrors: true,
      },
    ],
    handler: async ({ data, user, locale, logger }) => {
      return await consultationCreateRepository.createConsultation(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
