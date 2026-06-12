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
      MessagesRepository.listMessages(urlPathParams, user, t, logger, locale),
    canSubscribe: async ({ user, urlPathParams, logger }) => {
      const threadId = urlPathParams["threadId"];
      if (!threadId) {
        return false;
      }

      const { db } = await import("@/app/api/[locale]/system/db");
      const { chatFolders, chatThreads } = await import("../../../db");
      const { eq } = await import("drizzle-orm");
      const { canViewThread } =
        await import("../../../permissions/permissions");

      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);
      if (!thread) {
        return true;
      }
      const folder = thread.folderId
        ? await db
            .select()
            .from(chatFolders)
            .where(eq(chatFolders.id, thread.folderId))
            .limit(1)
            .then(([f]) => f ?? null)
        : null;
      return canViewThread(user, thread, folder, logger, "en-US");
    },
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, t, logger, locale }) =>
      MessagesRepository.createMessage(
        { ...data, threadId: urlPathParams.threadId },
        user,
        t,
        logger,
        locale,
      ),
  },
});
