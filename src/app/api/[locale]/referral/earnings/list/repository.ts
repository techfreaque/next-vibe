import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import type { ReferralT } from "../../i18n";
import { ReferralRepository } from "../../repository";
import type { EarningsListGetResponseOutput } from "./definition";

export const EarningsListRepository = {
  listEarnings(
    data: {
      targetUserId?: string | null;
      limit?: number | null;
      offset?: number | null;
    },
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: ReferralT,
  ): Promise<ResponseType<EarningsListGetResponseOutput>> {
    if (user.isPublic || !user.id) {
      return Promise.resolve(
        fail({
          message: t("errors.unauthorized.description"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        }),
      );
    }
    const isAdmin = user.roles.includes(UserPermissionRole.ADMIN);
    const targetUserId =
      isAdmin && data.targetUserId ? data.targetUserId : user.id;
    return ReferralRepository.getReferralEarnings(
      targetUserId,
      data.limit ?? 50,
      data.offset ?? 0,
      logger,
      t,
    );
  },
};
