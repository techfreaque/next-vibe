/**
 * SMTP Account Create API Route Handler
 * Handles POST requests for creating SMTP accounts with optional communication notifications
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { smtpAccountCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined, // No emails for POST requests
    handler: ({ data, user, locale, logger }) =>
      smtpAccountCreateRepository.createSmtpAccount(data, user, locale, logger),
  },
});
