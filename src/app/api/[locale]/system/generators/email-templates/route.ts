/**
 * Email Template Generator Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definition from "./definition";

export const { tools } = endpointsHandler({
  endpoint: definition,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger, t }) => {
      const { EmailTemplateGeneratorRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return EmailTemplateGeneratorRepository.generateEmailTemplates(
        data,
        logger,
        t,
      );
    },
  },
});
