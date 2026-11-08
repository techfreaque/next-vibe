import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { FolderProjectRepository } from "./repository";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      FolderProjectRepository.getProject(
        user,
        { id: urlPathParams.subFolderId },
        logger,
        locale,
      ),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      FolderProjectRepository.updateInstructions(
        user,
        { id: urlPathParams.subFolderId, instructions: data.instructions },
        logger,
        locale,
      ),
  },
});
