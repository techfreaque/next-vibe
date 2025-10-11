import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import avatarEndpoints from "./definition";
import { avatarRepository } from "./repository";

export const { POST, DELETE, tools } = endpointsHandler({
  endpoint: avatarEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ user, data, logger }) => {
      return await avatarRepository.uploadAvatar(
        user.id,
        data.fileUpload.file,
        logger,
      );
    },
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: async ({ user, logger }) => {
      return await avatarRepository.deleteAvatar(user.id, logger);
    },
  },
});
