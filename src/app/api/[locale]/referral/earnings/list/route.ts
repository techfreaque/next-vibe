/**
 * Referral Earnings List API Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { ReferralRepository } from "../../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, logger, t }) => {
      const isAdmin = user.roles.includes(UserPermissionRole.ADMIN);
      const targetUserId =
        isAdmin && data.targetUserId ? data.targetUserId : user.id;
      return await ReferralRepository.getReferralEarnings(
        targetUserId,
        data.limit ?? 50,
        data.offset ?? 0,
        logger,
        t,
      );
    },
  },
});
