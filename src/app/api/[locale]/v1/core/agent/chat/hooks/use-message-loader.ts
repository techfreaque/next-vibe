/**
 * Message Loader Hook
 * Handles loading messages for the active thread
 */

import { useEffect, useRef } from "react";

import { AUTH_STATUS_COOKIE_PREFIX } from "@/config/constants";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ChatMessage, ChatThread } from "./store";

/**
 * Hook for loading messages when activeThreadId changes
 */
export function useMessageLoader(
  locale: CountryLanguage,
  logger: EndpointLogger,
  activeThreadId: string | null,
  threads: Record<string, ChatThread>,
  addMessage: (message: ChatMessage) => void,
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

    // Check if user is authenticated
    const authStatusCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(AUTH_STATUS_COOKIE_PREFIX));
    const isAuthenticated = authStatusCookie !== undefined;

    // Skip loading for incognito mode (messages are in localStorage)
    const thread = threads[activeThreadId];
    if (!thread || thread.rootFolderId === "incognito") {
      return;
    }

    // Skip if not authenticated
    if (!isAuthenticated) {
      return;
    }

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
            // Add messages to store
            data.data.messages.forEach((message) => {
              addMessage({
                id: message.id,
                threadId: message.threadId,
                role: message.role,
                content: message.content,
                model: message.model,
                persona: message.persona,
                parentId: message.parentId,
                depth: message.depth,
                authorId: null,
                authorName: null,
                isAI: message.role === "assistant" || message.role === "tool",
                errorType: null,
                errorMessage: null,
                edited: false,
                tokens: null,
                toolCalls: message.toolCalls,
                upvotes: null,
                downvotes: null,
                sequenceId: message.sequenceId ?? null,
                sequenceIndex: message.sequenceIndex ?? 0,
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
  }, [activeThreadId, locale, logger]);
}
