import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { FolderProjectRepository } from "../repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({
      data,
      urlPathParams,
      user,
      logger,
      locale,
      toolExecutionContext,
    }) =>
      FolderProjectRepository.addFile(
        user,
        {
          id: urlPathParams.subFolderId,
          name: data.name,
          content: data.content,
        },
        logger,
        locale,
        toolExecutionContext,
      ),
  },
});
