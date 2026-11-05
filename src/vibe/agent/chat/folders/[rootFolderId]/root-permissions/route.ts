/**
 * Root Folder Permissions API Route
 * GET /api/[locale]/vibe/agent/chat/folders/[rootFolderId]/root-permissions
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { RootFolderPermissionsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      RootFolderPermissionsRepository.getRootFolderPermissions(
        urlPathParams,
        user,
        locale,
        logger,
      ),
  },
});
