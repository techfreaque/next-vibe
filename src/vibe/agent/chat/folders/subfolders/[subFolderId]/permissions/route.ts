/**
 * Chat Folder Permissions API Route Handler
 * Handles GET and PATCH requests for folder permissions (moderator management)
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { FolderPermissionsRepository } from "./repository";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, urlPathParams, logger, t, locale }) =>
      FolderPermissionsRepository.getFolderPermissions(
        user,
        { id: urlPathParams.subFolderId },
        logger,
        t,
        locale,
      ),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ data, urlPathParams, user, logger, t, locale }) =>
      FolderPermissionsRepository.updateFolderPermissions(
        user,
        { ...data, id: urlPathParams.subFolderId },
        logger,
        t,
        locale,
      ),
  },
});
