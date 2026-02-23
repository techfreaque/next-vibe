/**
 * Chat Messages API Route Handler
 * Handles GET and POST requests for messages in a thread
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { MessagesRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, t, logger, locale }) =>
      MessagesRepository.listMessages(
        { threadId: urlPathParams.threadId },
        user,
        t,
        logger,
        locale,
      ),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, t, logger, locale }) =>
      MessagesRepository.createMessage(
        {
          ...data,
          threadId: urlPathParams.threadId,
        },
        user,
        t,
        logger,
        locale,
      ),
  },
});
