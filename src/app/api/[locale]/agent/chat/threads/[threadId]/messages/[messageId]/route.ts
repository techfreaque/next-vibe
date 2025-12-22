/**
 * Message by ID Route Handler
 * Handles GET, PATCH, and DELETE requests for individual messages
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { ApiHandlerProps } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import type {
  MessageDeleteResponseOutput,
  MessageGetResponseOutput,
  MessagePatchResponseOutput,
} from "./definition";
import definitions from "./definition";
import { MessageRepository } from "./repository";

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
      return await MessageRepository.getMessage(
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
      return await MessageRepository.updateMessage(
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
      return await MessageRepository.deleteMessage(
        props.urlPathParams,
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
});
