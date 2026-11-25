import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CoaJournalPostRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ urlPathParams, user, logger, locale }) =>
      CoaJournalPostRepository.postEntry(
        urlPathParams.entryId,
        user,
        logger,
        locale,
      ),
  },
});
