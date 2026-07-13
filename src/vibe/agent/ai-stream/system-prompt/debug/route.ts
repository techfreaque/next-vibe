import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { buildDebugSystemPrompt } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      buildDebugSystemPrompt({
        rootFolderId: data.rootFolderId,
        userMessage: data.userMessage,
        threadId: data.threadId,
        skillId: data.skillId,
        subFolderId: data.subFolderId,
        imageGenModelSelection: data.imageGenModelSelection ?? null,
        musicGenModelSelection: data.musicGenModelSelection ?? null,
        videoGenModelSelection: data.videoGenModelSelection ?? null,
        user,
        locale,
        logger,
      }),
  },
});
