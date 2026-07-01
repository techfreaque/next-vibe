/**
 * Chat Folders Client-Side Route Handler
 * Mirrors server route.ts structure but uses client repository (localStorage)
 * Handles GET (list) requests for incognito folders
 */

import { Methods } from "next-vibe/core/definition/enums";
import { clientEndpointsHandler } from "next-vibe/core/route/client-multi";

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
