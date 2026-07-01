/**
 * Email Template Generator Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";

export const { tools } = endpointsHandler({
  endpoint: definition,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger, t }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).EmailTemplateGeneratorRepository.generateEmailTemplates(
        data,
        logger,
        t,
      ),
  },
});
