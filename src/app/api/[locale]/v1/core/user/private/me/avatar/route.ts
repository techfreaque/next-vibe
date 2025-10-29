import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";

import avatarEndpoints from "./definition";
import { avatarRepository } from "./repository";

export const { POST, DELETE, tools } = endpointsHandler({
  endpoint: avatarEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ user, data, locale, logger }) => {
      return await avatarRepository.uploadAvatar(
        authRepository.requireUserId(user as JwtPrivatePayloadType),
        data.fileUpload.file,
        locale,
        logger,
      );
    },
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: async ({ user, locale, logger }) => {
      return await avatarRepository.deleteAvatar(
        authRepository.requireUserId(user as JwtPrivatePayloadType),
        locale,
        logger,
      );
    },
  },
});
