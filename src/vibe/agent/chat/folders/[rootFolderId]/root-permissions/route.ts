/**
 * Root Folder Permissions API Route
 * GET /api/[locale]/agent/chat/folders/root-permissions
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { RootFolderPermissionsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      RootFolderPermissionsRepository.getRootFolderPermissions(
        data,
        user,
        locale,
        logger,
      ),
  },
});
