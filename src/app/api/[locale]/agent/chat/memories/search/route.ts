/**
 * Memory Search Route Handler
 * Handles GET requests for searching memories by content
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { MemoriesRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger }) =>
      MemoriesRepository.searchMemories({
        userId: user.id,
        query: data.query,
        includeArchived: data.includeArchived,
        tags: data.tags,
        logger,
      }),
  },
});
