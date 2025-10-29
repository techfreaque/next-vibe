/**
 * IMAP Accounts List API Route Handler
 * Handles GET requests for listing IMAP accounts with filtering and pagination
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import {
  ImapAccountSortField,
  ImapAccountStatusFilter,
  SortOrder,
} from "../../enum";
import { imapAccountsRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: ({ data, user, locale, logger }) => {
      // Apply defaults to ensure required fields are present
      const processedData = {
        page: data.page ?? 1,
        limit: data.limit ?? 20,
        status: data.status ?? ImapAccountStatusFilter.ALL,
        sortBy: data.sortBy ?? ImapAccountSortField.CREATED_AT,
        sortOrder: data.sortOrder ?? SortOrder.DESC,
        search: data.search,
        enabled: data.enabled,
      };
      return imapAccountsRepository.listAccounts(
        processedData,
        user,
        locale,
        logger,
      );
    },
  },
});
