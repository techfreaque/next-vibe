import "server-only";

import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";

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
