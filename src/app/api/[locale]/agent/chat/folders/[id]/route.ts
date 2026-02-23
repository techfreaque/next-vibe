/**
 * Chat Folder by ID API Route Handler
 * Handles GET, PATCH, and DELETE requests for individual folders
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { FolderRepository } from "./repository";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, urlPathParams, logger, locale }) =>
      FolderRepository.getFolder(user, urlPathParams, logger, locale),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      FolderRepository.updateFolder(
        user,
        { ...data, id: urlPathParams.id },
        logger,
        locale,
      ),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ user, urlPathParams, logger, locale }) =>
      FolderRepository.deleteFolder(user, urlPathParams, logger, locale),
  },
});
