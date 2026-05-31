/**
 * Company Member Invite API Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { MemberInviteRepository } from "./repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ urlPathParams, data, logger, user, locale }) =>
      MemberInviteRepository.inviteMember(
        urlPathParams.companyId,
        user.id,
        data,
        logger,
        locale,
      ),
  },
});
