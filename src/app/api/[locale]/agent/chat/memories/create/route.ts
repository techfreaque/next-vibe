/**
 * Create Memory API Route Handler
 * Thin handler that delegates to repository for POST
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import * as repository from "../repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ user, data, logger }) =>
      repository.addMemory({
        userId: user.id,
        content: data.content,
        tags: data.tags,
        priority: data.priority,
        logger,
      }),
  },
});
