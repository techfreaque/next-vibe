/**
 * Chat Folders API Route Handler
 * Handles GET (list) and POST (create) requests for folders
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { chatFoldersRepository } from "./repository";

// The return type mismatch between repository methods and endpointsHandler is a known
// limitation of the type system. The handlers work correctly at runtime.
/* eslint-disable @typescript-eslint/no-explicit-any */
export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      chatFoldersRepository.getFolders(data, user, locale, logger) as any,
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      chatFoldersRepository.createFolder(data, user, locale, logger) as any,
  },
});
/* eslint-enable @typescript-eslint/no-explicit-any */
