import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { FolderRepository } from "./repository";

export const { GET, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      FolderRepository.getFolder(
        user,
        { id: urlPathParams.subFolderId },
        logger,
        locale,
      ),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      FolderRepository.deleteFolder(
        user,
        { id: urlPathParams.subFolderId },
        logger,
        locale,
      ),
  },
});
