import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { listBankFeeds, syncBankFeed } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      listBankFeeds(
        data.companyId,
        user.id,
        data.checkApplication,
        logger,
        locale,
        data.directoryCountry,
        data.directoryPersonal,
      ),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      syncBankFeed(user.id, data, logger, locale),
  },
});
