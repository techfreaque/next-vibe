/**
 * Memories API Route Handler
 * Thin handler that delegates to repository for GET
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { DefaultFolderId } from "../config";
import definitions from "./definition";
import * as repository from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, logger, rootFolderId }) =>
      repository.getMemories({
        userId: user.id,
        logger,
        rootFolderId: rootFolderId ?? DefaultFolderId.PRIVATE,
      }),
  },
});
