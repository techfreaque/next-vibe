/**
 * Purchase Order Line Remove Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { OrderLineRemoveRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      OrderLineRemoveRepository.removeLine(
        urlPathParams.poId,
        urlPathParams.lineId,
        user.id,
        logger,
        locale,
      ),
  },
});
