import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { FolderRepository } from "../repository";
import definitions from "./definition";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      FolderRepository.updateFolder(
        user,
        { ...data, id: urlPathParams.subFolderId },
        logger,
        locale,
      ),
  },
});
