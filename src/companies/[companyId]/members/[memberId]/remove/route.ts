/**
 * Company Member Remove API Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { RemoveMemberRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ urlPathParams, logger, user, locale }) =>
      RemoveMemberRepository.removeMember(
        urlPathParams.companyId,
        urlPathParams.memberId,
        user.id,
        logger,
        locale,
      ),
  },
});
