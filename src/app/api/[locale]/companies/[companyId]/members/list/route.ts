/**
 * Company Members List API Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { MembersListRepository } from "./repository";
import definitions from "./definition";

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
