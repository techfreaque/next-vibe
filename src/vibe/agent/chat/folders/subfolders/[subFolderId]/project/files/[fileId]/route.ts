import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { FolderProjectRepository } from "../../repository";
import definitions from "./definition";

export const { DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      FolderProjectRepository.removeFile(
        user,
        { id: urlPathParams.subFolderId, fileId: urlPathParams.fileId },
        logger,
        locale,
      ),
  },
});
