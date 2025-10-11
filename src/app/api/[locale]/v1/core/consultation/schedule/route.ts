/**
 * Consultation Schedule Route Handler
 * Enhanced route handler for scheduling consultations
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import scheduleEndpoints from "./definition";
import {
  consultationScheduleAdminEmail,
  consultationScheduledEmail,
} from "./email";
import { consultationScheduleRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: scheduleEndpoints,
  [Methods.POST]: {
    email: [
      {
        render: consultationScheduledEmail,
        ignoreErrors: false,
      },
      {
        render: consultationScheduleAdminEmail,
        ignoreErrors: false,
      },
    ],
    handler: async ({ data, locale, logger }) => {
      // Execute main business logic only - emails handled via the email property
      return await consultationScheduleRepository.scheduleConsultation(
        data,
        locale,
        logger,
      );
    },
  },
});
