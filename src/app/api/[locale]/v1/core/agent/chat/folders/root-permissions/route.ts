/**
 * Root Folder Permissions API Route
 * GET /api/[locale]/v1/core/agent/chat/folders/root-permissions
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { rootFolderPermissionsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return await rootFolderPermissionsRepository.getRootFolderPermissions(
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
