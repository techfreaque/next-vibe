/**
 * Chart of Accounts — Journal Entry Get Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CoaJournalEntryGetRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      CoaJournalEntryGetRepository.getEntry(
        urlPathParams.entryId,
        user.id,
        logger,
        locale,
      ),
  },
});
