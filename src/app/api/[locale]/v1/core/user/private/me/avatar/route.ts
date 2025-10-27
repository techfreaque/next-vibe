import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import avatarEndpoints from "./definition";
import { avatarRepository } from "./repository";

export const { POST, DELETE, tools } = endpointsHandler({
  endpoint: avatarEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ user, data, locale, logger }) => {
      return await avatarRepository.uploadAvatar(
        user.id,
        data.fileUpload.file,
        locale,
        logger,
      );
    },
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: async ({ user, locale, logger }) => {
      return await avatarRepository.deleteAvatar(user.id, locale, logger);
    },
  },
});
