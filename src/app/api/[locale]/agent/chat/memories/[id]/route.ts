/**
 * Single Memory API Route Handler
 * Thin handlers that delegate to repository
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import * as repository from "../repository";
import definitions from "./definition";

export const { PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ user, data, urlPathParams, logger }) =>
      repository.updateMemory({
        userId: user.id,
        memoryId: urlPathParams.id,
        content: data.content,
        tags: data.tags,
        priority: data.priority,
        logger,
      }),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ user, urlPathParams, logger }) =>
      repository.deleteMemory({
        userId: user.id,
        memoryId: urlPathParams.id,
        logger,
      }),
  },
});
