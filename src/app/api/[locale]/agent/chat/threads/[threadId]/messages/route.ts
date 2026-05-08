/**
 * Chat Messages API Route Handler
 * Handles GET and POST requests for messages in a thread
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { MessagesRepository } from "./repository";
import { db } from "@/app/api/[locale]/system/db";
import { chatFolders, chatThreads } from "../../../db";
import { eq } from "drizzle-orm";
import { canViewThread } from "../../../permissions/permissions";

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

      const [thread] = await db
        .select()
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId))
        .limit(1);
      if (!thread) {
        // Incognito/pre-persist threads: channel UUID is unguessable,
        // stream auth is enforced by the POST endpoint.
        return true;
      }
      let folder = null;
      if (thread.folderId) {
        const [f] = await db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.id, thread.folderId))
          .limit(1);
        folder = f ?? null;
      }
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
