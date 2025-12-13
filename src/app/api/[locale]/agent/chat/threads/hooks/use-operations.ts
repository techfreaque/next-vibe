/**
 * Thread Operations Hook
 * Handles all thread-related CRUD operations (create, update, delete)
 * Located in threads/ folder as per architectural standards
 */

import { useCallback } from "react";

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ChatThread } from "../../hooks/store";

/**
 * Thread update type
 */
export type ThreadUpdate = Partial<
  Pick<
    ChatThread,
    | "title"
    | "rootFolderId"
    | "folderId"
    | "status"
    | "defaultModel"
    | "systemPrompt"
    | "pinned"
    | "archived"
    | "tags"
  >
>;

/**
 * Thread operations interface
 * NOTE: createNewThread and setActiveThread removed - use router.push() for navigation instead
 */
export interface ThreadOperations {
  deleteThread: (
    threadId: string,
    activeThreadId: string | null,
  ) => Promise<void>;
  updateThread: (threadId: string, updates: ThreadUpdate) => Promise<void>;
}

/**
 * Thread operations dependencies
 */
interface ThreadOperationsDeps {
  locale: CountryLanguage;
  logger: EndpointLogger;
  chatStore: {
    threads: Record<string, ChatThread>;
    deleteThread: (threadId: string) => void;
    updateThread: (threadId: string, updates: Partial<ChatThread>) => void;
  };
  streamStore: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    threads: Record<string, any>;
    reset: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addThread: (thread: any) => void;
  };
}

/**
 * Hook for thread operations
 */
export function useThreadOperations(
  deps: ThreadOperationsDeps,
): ThreadOperations {
  const { locale, logger, chatStore, streamStore } = deps;

  const deleteThread = useCallback(
    async (threadId: string, activeThreadId: string | null): Promise<void> => {
      logger.debug("Thread operations: Deleting thread", { threadId });

      const isActiveThread = activeThreadId === threadId;
      const thread = chatStore.threads[threadId];

      if (!thread) {
        logger.error("Thread operations: Thread not found", { threadId });
        return;
      }

      const threadRootFolderId = thread.rootFolderId;
      const threadSubFolderId = thread.folderId;

      // Handle incognito thread deletion
      if (thread.rootFolderId === "incognito") {
        logger.debug(
          "Thread operations: Deleting incognito thread (localStorage only)",
          { threadId },
        );

        const { deleteThread: deleteIncognitoThread } =
          await import("../../incognito/storage");

        deleteIncognitoThread(threadId);
        chatStore.deleteThread(threadId);

        if (isActiveThread) {
          const { buildFolderUrl } =
            await import("@/app/[locale]/chat/lib/utils/navigation");
          const url = `${buildFolderUrl(locale, threadRootFolderId, threadSubFolderId)}/new`;
          logger.debug(
            "Thread operations: Navigating to new thread page after deletion",
            { url, threadRootFolderId, threadSubFolderId },
          );
          window.location.href = url;
        }

        return;
      }

      // Handle server-side thread deletion
      try {
        const response = await fetch(
          `/api/${locale}/agent/chat/threads/${threadId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          logger.error("Thread operations: Failed to delete thread", {
            status: response.status,
          });
          return;
        }

        chatStore.deleteThread(threadId);

        // Delete from streaming store
        if (streamStore.threads[threadId]) {
          // eslint-disable-next-line no-unused-vars -- Destructuring pattern to omit property
          const { [threadId]: _deleted, ...remainingThreads } =
            streamStore.threads;
          streamStore.reset();
          Object.values(remainingThreads).forEach((thread) => {
            streamStore.addThread(thread);
          });
        }

        if (isActiveThread) {
          const { buildFolderUrl } =
            await import("@/app/[locale]/chat/lib/utils/navigation");
          const url = `${buildFolderUrl(locale, threadRootFolderId, threadSubFolderId)}/new`;
          logger.debug(
            "Thread operations: Navigating to new thread page after deletion",
            { url, threadRootFolderId, threadSubFolderId },
          );
          window.location.href = url;
        }
      } catch (error) {
        logger.error(
          "Thread operations: Failed to delete thread",
          parseError(error),
        );
      }
    },
    [logger, chatStore, locale, streamStore],
  );

  const updateThread = useCallback(
    async (threadId: string, updates: ThreadUpdate): Promise<void> => {
      logger.debug("Thread operations: Updating thread", {
        threadId,
        updatedFields: Object.keys(updates).join(", "),
      });

      const thread = chatStore.threads[threadId];
      if (thread && thread.rootFolderId === "incognito") {
        logger.debug(
          "Thread operations: Updating incognito thread (localStorage only)",
          { threadId },
        );

        const { updateIncognitoThread } =
          await import("../../incognito/storage");

        updateIncognitoThread(threadId, updates);
        chatStore.updateThread(threadId, updates);

        return;
      }

      // Handle server-side thread update
      try {
        const response = await fetch(
          `/api/${locale}/agent/chat/threads/${threadId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ updates }),
          },
        );

        if (!response.ok) {
          logger.error("Thread operations: Failed to update thread", {
            status: response.status,
          });
          return;
        }

        chatStore.updateThread(threadId, updates);
      } catch (error) {
        logger.error(
          "Thread operations: Failed to update thread",
          parseError(error),
        );
      }
    },
    [logger, chatStore, locale],
  );

  return {
    deleteThread,
    updateThread,
  };
}
