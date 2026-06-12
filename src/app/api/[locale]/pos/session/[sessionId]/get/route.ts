/**
 * POS Session Get API Route Handler
 */
import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { PosSessionGetRepository } from "./repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      PosSessionGetRepository.getSession(
        urlPathParams.sessionId,
        user.id,
        logger,
        locale,
      ),
  },
});
