/**
 * Memories API Route Handler
 * Thin handler that delegates to repository for GET
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { DefaultFolderId } from "../config";
import definitions from "./definition";
import { MemoriesRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, logger, streamContext }) => {
      return MemoriesRepository.getMemories({
        userId: user.id,
        logger,
        rootFolderId: streamContext.rootFolderId ?? DefaultFolderId.PRIVATE,
        search: data.search,
        tag: data.tag,
      });
    },
  },
});
