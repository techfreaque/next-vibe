import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { VatReturnRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.GET]: {
    handler: ({ data, user, logger, locale }) =>
      VatReturnRepository.prepare(data, user.id, logger, locale),
  },
});
