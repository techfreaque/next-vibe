/**
 * Chat Threads API Route Handler
 * Handles GET (list) and POST (create) requests for threads
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ThreadsRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, user, t, logger, locale }) =>
      ThreadsRepository.listThreads(data, user, t, logger, locale),
    canSubscribe: ({ user }) => !!user.leadId,
  },
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, t, logger, locale }) =>
      ThreadsRepository.createThread(data, user, t, logger, locale),
    onRemoteEvent: {
      "thread-created": (payload, ctx) =>
        ThreadsRepository.applyRemoteThreadCreate(
          payload,
          ctx.user,
          ctx.logger,
        ),
    },
  },
});
