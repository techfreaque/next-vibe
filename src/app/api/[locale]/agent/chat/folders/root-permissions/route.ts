/**
 * Root Folder Permissions API Route
 * GET /api/[locale]/agent/chat/folders/root-permissions
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { RootFolderPermissionsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return await RootFolderPermissionsRepository.getRootFolderPermissions(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
