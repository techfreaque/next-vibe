/**
 * Chart of Accounts — Journal Entry Get Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
