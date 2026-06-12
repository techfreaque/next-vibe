/**
 * Remove Invoice Line Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import lineRemoveDefinitions from "./definition";
import { InvoiceLineRemoveRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: lineRemoveDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      InvoiceLineRemoveRepository.removeLine(
        user.id,
        urlPathParams,
        logger,
        locale,
      ),
  },
});
