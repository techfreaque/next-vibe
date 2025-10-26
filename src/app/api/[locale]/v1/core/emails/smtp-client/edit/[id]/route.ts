/**
 * SMTP Account Edit API Route Handler
 * Handles GET and PUT requests for editing SMTP accounts
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { smtpAccountEditRepository } from "./repository";

export const { GET, PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: ({ urlPathParams, user, locale, logger }) =>
      smtpAccountEditRepository.getSmtpAccount(
        urlPathParams,
        user,
        locale,
        logger,
      ),
  },
  [Methods.PUT]: {
    email: undefined, // No emails for PUT requests
    handler: ({ data, urlPathParams, user, locale, logger }) => {
      const updateData = {
        id: urlPathParams.id,
        name: data.updates.name,
        description: data.updates.description,
        host: data.updates.host,
        port: data.updates.port,
        securityType: data.updates.securityType,
        username: data.updates.username,
        password: data.updates.password,
        fromEmail: data.updates.fromEmail,
        priority: data.updates.priority,
      };
      return smtpAccountEditRepository.updateSmtpAccount(
        updateData,
        user,
        locale,
        logger,
      );
    },
  },
});
