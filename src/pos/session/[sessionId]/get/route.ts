/**
 * POS Session Get API Route Handler
 */
import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { PosSessionGetRepository } from "./repository";

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
