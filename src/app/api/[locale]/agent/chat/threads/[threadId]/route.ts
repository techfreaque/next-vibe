/**
 * Chat Thread by ID API Route Handler
 * Handles GET, PATCH, and DELETE requests for individual threads
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { threadByIdRepository } from "./repository";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ urlPathParams, user, locale, logger }) => {
      return await threadByIdRepository.getThreadById(
        urlPathParams.threadId,
        user,
        locale,
        logger,
      );
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ data, urlPathParams, user, logger }) => {
      return await threadByIdRepository.updateThread(
        data,
        urlPathParams.threadId,
        user,
        logger,
      );
    },
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: async ({ urlPathParams, user, logger }) => {
      return await threadByIdRepository.deleteThread(
        urlPathParams.threadId,
        user,
        logger,
      );
    },
  },
});
