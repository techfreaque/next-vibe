import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { ChatFoldersRepository } from "../repository";
import createFolderDefinition from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: createFolderDefinition,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      ChatFoldersRepository.createFolder(data, user, locale, logger),
  },
});
