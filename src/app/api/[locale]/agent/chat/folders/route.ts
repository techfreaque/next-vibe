/**
 * Chat Folders API Route Handler
 * Handles GET (list) requests for folders
 * POST (create) is handled by folders/create/route.ts
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ChatFoldersRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      ChatFoldersRepository.getFolders(data, user, locale, logger),
  },
});
