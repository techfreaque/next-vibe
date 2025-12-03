/**
 * Memories API Route Handler
 * Thin handlers that delegate to repository
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import * as repository from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, logger }) => {
      return repository.getMemories({ userId: user.id, logger });
    },
  },
  [Methods.POST]: {
    email: undefined,
    handler: async ({ user, data, logger }) => {
      return repository.addMemory({
        userId: user.id,
        content: data.content,
        tags: data.tags,
        priority: data.priority,
        logger,
      });
    },
  },
});
