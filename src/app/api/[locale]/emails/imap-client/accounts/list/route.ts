/**
 * IMAP Accounts List API Route Handler
 * Handles GET requests for listing IMAP accounts with filtering and pagination
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { imapAccountsRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: ({ data, user, logger }) => {
      return imapAccountsRepository.listAccounts(data, user, logger);
    },
  },
});
