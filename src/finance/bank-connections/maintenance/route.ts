import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { maintainBankFeeds } from "./repository";
export const { POST, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.POST]: {
    handler: ({ logger, locale }) => maintainBankFeeds(logger, locale),
  },
});
