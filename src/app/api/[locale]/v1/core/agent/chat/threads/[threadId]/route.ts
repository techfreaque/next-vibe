/**
 * Chat Thread by ID API Route Handler
 * Handles GET, PATCH, and DELETE requests for individual threads
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { threadByIdRepository } from "./repository";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (props) => {
      return await threadByIdRepository.getThreadById(
        props.urlPathParams.threadId,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async (props) => {
      return await threadByIdRepository.updateThread(
        props.data,
        props.urlPathParams.threadId,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: async (props) => {
      return await threadByIdRepository.deleteThread(
        props.urlPathParams.threadId,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
});
