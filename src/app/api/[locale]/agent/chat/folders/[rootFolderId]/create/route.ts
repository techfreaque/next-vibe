import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation as foldersScopedTranslation } from "../i18n";
import { ChatFoldersRepository } from "../repository";
import createFolderDefinition from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: createFolderDefinition,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, locale, logger }) => {
      const { t } = foldersScopedTranslation.scopedT(locale);
      return ChatFoldersRepository.createFolder(
        data,
        user,
        t,
        logger,
        locale,
        urlPathParams.rootFolderId,
      );
    },
  },
});
