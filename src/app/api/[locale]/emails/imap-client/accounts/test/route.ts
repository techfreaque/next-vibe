/**
 * IMAP Account Test Connection API Route Handler
 * Handles POST requests for testing IMAP account connections
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { imapAccountsRepository } from "../repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger }) => {
      return imapAccountsRepository.testAccountConnection(
        { id: data.accountId },
        user,
        logger,
      );
    },
  },
});
