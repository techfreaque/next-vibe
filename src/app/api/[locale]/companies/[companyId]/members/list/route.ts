/**
 * Company Members List API Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { MembersListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, logger, user, locale }) =>
      MembersListRepository.listMembers(
        urlPathParams.companyId,
        user.id,
        logger,
        locale,
      ),
  },
});
