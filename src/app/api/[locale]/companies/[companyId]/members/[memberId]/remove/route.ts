/**
 * Company Member Remove API Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { RemoveMemberRepository } from "./repository";
import definitions from "./definition";

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
