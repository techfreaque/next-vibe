import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import avatarEndpoints from "./definition";
import { AvatarRepository } from "./repository";

export const { POST, DELETE, tools } = endpointsHandler({
  endpoint: avatarEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ user, data, locale, logger, t }) =>
      AvatarRepository.uploadAvatar(
        user.id,
        data.fileUpload.file,
        locale,
        logger,
        t,
      ),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ user, locale, logger, t }) =>
      AvatarRepository.deleteAvatar(user.id, locale, logger, t),
  },
});
