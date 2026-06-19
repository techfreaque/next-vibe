import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import headlessClientDefinition from "./definition";

export const { tools } = endpointsHandler({
  endpoint: headlessClientDefinition,
  [Methods.POST]: {
    handler: async ({ data, user, locale, logger }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).HeadlessClientRepository.start(data, user, locale, logger),
  },
});
