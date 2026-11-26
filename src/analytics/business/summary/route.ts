import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { PlatformSummaryRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, logger, t, locale }) =>
      PlatformSummaryRepository.get(
        logger,
        t,
        locale,
        data.section,
        data.profile,
      ),
  },
});
