/**
 * Emails List API Route Handler
 * Handles GET requests for listing emails with filtering and pagination
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { emailsRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      emailsRepository.getEmails(data, user, locale, logger),
  },
});
