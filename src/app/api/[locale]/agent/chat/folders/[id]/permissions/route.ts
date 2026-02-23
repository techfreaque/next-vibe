/**
 * Chat Folder Permissions API Route Handler
 * Handles GET and PATCH requests for folder permissions (moderator management)
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { getFolderPermissions, updateFolderPermissions } from "./repository";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, urlPathParams, logger, t, locale }) => {
      return await getFolderPermissions(
        user,
        { id: urlPathParams.id },
        logger,
        t,
        locale,
      );
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ data, urlPathParams, user, logger, t, locale }) => {
      return await updateFolderPermissions(
        user,
        { ...data, id: urlPathParams.id },
        logger,
        t,
        locale,
      );
    },
  },
});
