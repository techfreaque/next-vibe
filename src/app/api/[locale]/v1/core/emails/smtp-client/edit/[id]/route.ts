/**
 * SMTP Account Edit API Route Handler
 * Handles GET and PUT requests for editing SMTP accounts
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import definitions from "./definition";
import { smtpAccountEditRepository } from "./repository";

export const { GET, PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: async ({ data, urlVariables }) => {
      return await smtpAccountEditRepository.getSmtpAccount(data, urlVariables);
    },
  },
  [Methods.PUT]: {
    email: undefined, // No emails for PUT requests
    handler: async ({ data, urlVariables }) => {
      return await smtpAccountEditRepository.updateSmtpAccount(
        data,
        urlVariables,
      );
    },
  },
});
