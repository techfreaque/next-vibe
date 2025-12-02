/**
 * Message Loader Hook
 * Handles loading messages for the active thread
 */

import { useEffect, useRef } from "react";

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ChatMessage, ChatThread } from "../db";

/**
 * Hook for loading messages when activeThreadId changes
 */
export function useMessageLoader(
  locale: CountryLanguage,
  logger: EndpointLogger,
  activeThreadId: string | null,
  threads: Record<string, ChatThread>,
  addMessage: (message: ChatMessage) => void,
  isDataLoaded: boolean,
): void {
  const loadedThreadsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!activeThreadId) {
      return;
    }

    // Skip if messages already loaded for this thread
    if (loadedThreadsRef.current.has(activeThreadId)) {
      return;
    }

    // Wait for initial data load to complete before checking thread existence
    // This prevents race condition on page refresh where activeThreadId is set
    // but threads haven't been loaded from server yet
    if (!isDataLoaded) {
      return;
    }

    // Skip loading for incognito mode (messages are in localStorage)
    const thread = threads[activeThreadId];
    if (!thread || thread.rootFolderId === "incognito") {
      return;
    }

    // Public users can load messages from public threads
    // Authenticated users can load messages from all their threads
    // No need to check authentication here - the API will enforce permissions

    // Mark as loaded before starting request to prevent duplicate requests
    loadedThreadsRef.current.add(activeThreadId);

    // Load messages from server
    const loadMessages = async (): Promise<void> => {
      try {
        logger.debug("Chat: Loading messages for thread", {
          threadId: activeThreadId,
        });

        const response = await fetch(
          `/api/${locale}/v1/core/agent/chat/threads/${activeThreadId}/messages`,
        );

        if (response.ok) {
          const data = (await response.json()) as {
            success: boolean;
            data?: { messages?: ChatMessage[] };
          };
          logger.debug("Chat: Loaded messages", {
            threadId: activeThreadId,
            count: data.data?.messages?.length || 0,
          });

          if (data.success && data.data?.messages) {
            // Add messages to store (messages from API already have all required DB fields)
            data.data.messages.forEach((message) => {
              addMessage({
                ...message,
                createdAt: new Date(message.createdAt),
                updatedAt: new Date(message.updatedAt),
              });
            });
          }
        } else {
          logger.error("Chat: Failed to load messages", {
            threadId: activeThreadId,
            status: response.status,
          });
          // Remove from loaded set on error so it can be retried
          loadedThreadsRef.current.delete(activeThreadId);
        }
      } catch (error) {
        logger.error("Chat: Error loading messages", {
          threadId: activeThreadId,
          error: parseError(error).message,
        });
        // Remove from loaded set on error so it can be retried
        loadedThreadsRef.current.delete(activeThreadId);
      }
    };

    void loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThreadId, locale, logger, isDataLoaded]);
}
