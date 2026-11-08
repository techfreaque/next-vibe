/**
 * Channel Spend - Route
 * Server-only.
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { ChannelSpendRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ logger, t }) => ChannelSpendRepository.list(logger, t),
  },
  [Methods.POST]: {
    handler: ({ data, logger, t }) =>
      ChannelSpendRepository.log(data, logger, t),
  },
});
