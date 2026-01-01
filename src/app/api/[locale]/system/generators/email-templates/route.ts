/**
 * Email Template Generator Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definition from "./definition";
import { emailTemplateGeneratorRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger }) =>
      emailTemplateGeneratorRepository.generateEmailTemplates(data, logger),
  },
});
