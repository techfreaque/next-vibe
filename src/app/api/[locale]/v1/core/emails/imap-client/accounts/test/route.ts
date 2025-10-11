/**
 * IMAP Account Test Connection API Route Handler
 * Handles POST requests for testing IMAP account connections
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
    handler: ({ data, user, locale, logger }) => {
      return imapAccountsRepository.testAccountConnection(
        { id: data.accountId },
        user,
        locale,
        logger,
      );
    },
  },
});
