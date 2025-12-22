/**
 * Chat Folders API Route Handler
 * Handles GET (list) and POST (create) requests for folders
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ChatFoldersRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      ChatFoldersRepository.getFolders(data, user, locale, logger),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      ChatFoldersRepository.createFolder(data, user, locale, logger),
  },
});
