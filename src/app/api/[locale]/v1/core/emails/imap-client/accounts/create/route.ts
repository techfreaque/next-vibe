/**
 * IMAP Account Create API Route Handler
 * Handles POST requests for creating new IMAP accounts
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import { imapAccountsRepository } from "../repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      // Repository expects the nested structure from definition
      return await imapAccountsRepository.createAccount(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
