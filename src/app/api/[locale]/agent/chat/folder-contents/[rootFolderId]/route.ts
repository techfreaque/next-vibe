/**
 * Folder Contents API Route Handler
 * Handles GET requests for unified folder+thread lists
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { FolderContentsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, data, user, logger, t, locale }) =>
      FolderContentsRepository.getFolderContents(
        urlPathParams,
        data,
        user,
        t,
        logger,
        locale,
      ),
  },
});
