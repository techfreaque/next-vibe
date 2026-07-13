import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { ChatFoldersRepository } from "../repository";
import createFolderDefinition from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: createFolderDefinition,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, locale, logger }) =>
      ChatFoldersRepository.createFolder(
        data,
        user,
        locale,
        logger,
        urlPathParams.rootFolderId,
      ),
  },
});
