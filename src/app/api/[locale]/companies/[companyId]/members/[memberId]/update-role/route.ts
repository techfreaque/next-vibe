/**
 * Company Member Update Role API Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { UpdateRoleRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    handler: ({ urlPathParams, data, logger, user, locale }) =>
      UpdateRoleRepository.updateRole(
        urlPathParams.companyId,
        urlPathParams.memberId,
        user.id,
        data,
        logger,
        locale,
      ),
  },
});
