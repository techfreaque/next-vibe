/**
 * Chat Messages API Route Handler
 * Handles GET and POST requests for messages in a thread
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import type { ApiHandlerProps } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/handler-types";

import type {
  MessageCreateRequestOutput,
  MessageCreateResponseOutput,
  MessageCreateUrlParamsTypeOutput,
  MessageListRequestOutput,
  MessageListResponseOutput,
  MessageListUrlParamsTypeOutput,
} from "./definition";
import definitions from "./definition";
import { messagesRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        MessageListRequestOutput,
        MessageListUrlParamsTypeOutput,
        typeof definitions.GET.allowedRoles
      >,
    ): Promise<ResponseType<MessageListResponseOutput>> => {
      return await messagesRepository.listMessages(
        { threadId: props.urlPathParams.threadId },
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
  [Methods.POST]: {
    email: undefined,
    handler: async (
      props: ApiHandlerProps<
        MessageCreateRequestOutput,
        MessageCreateUrlParamsTypeOutput,
        typeof definitions.POST.allowedRoles
      >,
    ): Promise<ResponseType<MessageCreateResponseOutput>> => {
      return await messagesRepository.createMessage(
        {
          ...props.data,
          threadId: props.urlPathParams.threadId,
        },
        props.user,
        props.locale,
        props.logger,
      );
    },
  },
});
