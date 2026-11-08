/**
 * Refusal Index - Start Run Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { RefusalRunsRepository } from "../repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale, toolExecutionContext }) =>
      RefusalRunsRepository.start(
        data,
        user,
        logger,
        locale,
        toolExecutionContext,
      ),
  },
});
