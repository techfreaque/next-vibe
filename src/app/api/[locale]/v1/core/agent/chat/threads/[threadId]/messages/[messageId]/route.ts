/**
 * Message by ID Route Handler
 * Handles GET, PATCH, and DELETE requests for individual messages
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/handler";

import type {
  MessageDeleteResponseOutput,
  MessageGetResponseOutput,
  MessagePatchResponseOutput,
} from "./definition";
import definitions from "./definition";
import { messageRepository } from "./repository";

/**
 * Export route handlers
 */
export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,

  [Methods.GET]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        typeof definitions.GET.types.RequestOutput,
        typeof definitions.GET.types.UrlVariablesOutput,
        typeof definitions.GET.allowedRoles
      >,
    ): Promise<ResponseType<MessageGetResponseOutput>> => {
      return await messageRepository.getMessage(
        props.urlPathParams,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },

  [Methods.PATCH]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        typeof definitions.PATCH.types.RequestOutput,
        typeof definitions.PATCH.types.UrlVariablesOutput,
        typeof definitions.PATCH.allowedRoles
      >,
    ): Promise<ResponseType<MessagePatchResponseOutput>> => {
      return await messageRepository.updateMessage(
        props.data,
        props.urlPathParams,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },

  [Methods.DELETE]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        typeof definitions.DELETE.types.RequestOutput,
        typeof definitions.DELETE.types.UrlVariablesOutput,
        typeof definitions.DELETE.allowedRoles
      >,
    ): Promise<ResponseType<MessageDeleteResponseOutput>> => {
      return await messageRepository.deleteMessage(
        props.urlPathParams,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
});
