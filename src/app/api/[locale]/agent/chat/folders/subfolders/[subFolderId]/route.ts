import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { FolderRepository } from "./repository";

export const { GET, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      FolderRepository.getFolder(
        user,
        { id: urlPathParams.subFolderId },
        logger,
        locale,
      ),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      FolderRepository.deleteFolder(
        user,
        { id: urlPathParams.subFolderId },
        logger,
        locale,
      ),
  },
});
