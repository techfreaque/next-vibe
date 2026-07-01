/**
 * Chart of Accounts — Account Get Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { CoaAccountGetRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, user, logger, locale }) =>
      CoaAccountGetRepository.getAccount(
        urlPathParams.accountId,
        user.id,
        logger,
        locale,
      ),
  },
});
