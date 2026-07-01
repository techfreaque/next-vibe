import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
