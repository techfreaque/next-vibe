/**
 * Add Invoice Line Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import lineAddDefinitions from "./definition";
import { InvoiceLineAddRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: lineAddDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      InvoiceLineAddRepository.addLine(user.id, data, logger, locale),
  },
});
