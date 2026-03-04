/**
 * Chat Folders Client-Side Route Handler
 * Mirrors server route.ts structure but uses client repository (localStorage)
 * Handles GET (list) requests for incognito folders
 */

import { clientEndpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/client-multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ChatFoldersRepositoryClient } from "./repository-client";

/**
 * Client-side handlers - mirrors server route structure exactly
 */
export const { GET } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ logger, locale, urlPathParams }) =>
      ChatFoldersRepositoryClient.getFolders(urlPathParams, logger, locale),
  },
});
