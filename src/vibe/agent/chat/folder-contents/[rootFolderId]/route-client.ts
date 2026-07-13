/**
 * Folder Contents Client-Side Route Handler
 * Mirrors server route.ts structure but uses client repository (localStorage)
 * Handles GET requests for incognito folder contents
 */

import { Methods } from "next-vibe/core/definition/enums";
import { clientEndpointsHandler } from "next-vibe/core/route/client-multi";

import definitions from "./definition";
import { FolderContentsRepositoryClient } from "./repository-client";

/**
 * Client-side handlers - mirrors server route structure exactly
 */
export const { GET } = clientEndpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ urlPathParams, data, logger, locale }) =>
      FolderContentsRepositoryClient.getFolderContents(
        urlPathParams,
        data,
        logger,
        locale,
      ),
  },
});
