import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { MessagesRemoteRepository, MessagesRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, t, logger, locale }) =>
      MessagesRepository.listMessages(urlPathParams, user, t, logger, locale),
    canSubscribe: async ({ user, urlPathParams, logger, locale }) => {
      const threadId = urlPathParams["threadId"];
      if (!threadId) {
        return false;
      }

      const { db } = await import("@/app/api/[locale]/system/db");
      const { chatFolders, chatThreads: threads } = await import("../../../db");
      const { eq } = await import("drizzle-orm");
      const { canViewThread } =
        await import("../../../permissions/permissions");

      const [thread] = await db
        .select()
        .from(threads)
        .where(eq(threads.id, threadId))
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
      return canViewThread(user, thread, folder, logger, locale);
    },
    onRemoteEvent: {
      "message-created": (props) =>
        MessagesRemoteRepository.applyRemoteMessageCreated(props),
      error: (props) => MessagesRemoteRepository.applyRemoteError(props),
      "content-done": (props) =>
        MessagesRemoteRepository.applyRemoteContentDone(props),
      "tool-result": (props) =>
        MessagesRemoteRepository.applyRemoteToolResult(props),
      "tool-result-updated": (props) =>
        MessagesRemoteRepository.applyRemoteToolResultUpdated(props),
      "tokens-updated": (props) =>
        MessagesRemoteRepository.applyRemoteTokensUpdated(props),
      "stream-finished": (props) =>
        MessagesRemoteRepository.applyRemoteStreamFinished(props),
      "streaming-state-changed": (props) =>
        MessagesRemoteRepository.applyRemoteStreamingStateChanged(props),
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
