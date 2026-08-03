import "server-only";

import { Methods } from "../../../../core/definition/enums";
import { endpointsHandler } from "../../../../core/route/multi";

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
