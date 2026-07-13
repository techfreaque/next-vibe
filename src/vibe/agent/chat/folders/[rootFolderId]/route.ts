/**
 * Chat Folders API Route Handler
 * Handles GET (list) requests for folders
 * POST (create) is handled by folders/create/route.ts
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { ChatFoldersRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, t, locale }) =>
      ChatFoldersRepository.getFolders(urlPathParams, user, t, logger, locale),
  },
});
