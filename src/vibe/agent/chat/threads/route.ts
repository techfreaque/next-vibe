/**
 * Chat Threads API Route Handler
 * Handles GET (list) and POST (create) requests for threads
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { ThreadsRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, t, logger, locale }) =>
      ThreadsRepository.listThreads(data, user, t, logger, locale),
    onRemoteEvent: {
      "thread-title-updated": (props) =>
        ThreadsRepository.applyRemoteThreadTitleUpdated(props),
    },
  },
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, t, logger, locale }) =>
      ThreadsRepository.createThread(data, user, t, logger, locale),
    onRemoteEvent: {
      "thread-created": (props) =>
        ThreadsRepository.applyRemoteThreadCreate(props),
    },
  },
});
