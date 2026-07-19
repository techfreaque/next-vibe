import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import headlessClientDefinition from "./definition";

export const { tools } = endpointsHandler({
  endpoint: headlessClientDefinition,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) =>
      (await import("./repository")).HeadlessClientRepository.start(
        data,
        user,
        locale,
        logger,
      ),
  },
});
