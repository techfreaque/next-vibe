/**
 * Prompt Fragments Generator API Route
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) => {
      const { PromptFragmentsGeneratorRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return PromptFragmentsGeneratorRepository.generatePromptFragments(
        data,
        logger,
        t,
      );
    },
  },
});
