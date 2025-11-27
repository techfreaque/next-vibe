"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { DivRefObject } from "@/packages/next-vibe-ui/web/ui/div";
import type { JSX } from "react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAIStreamStore } from "@/app/api/[locale]/v1/core/agent/ai-stream/hooks/store";
import { useChatContext } from "@/app/api/[locale]/v1/core/agent/chat/hooks/context";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { envClient } from "@/config/env-client";

import {
  DOM_IDS,
  LAYOUT,
  QUOTE_CHARACTER,
} from "@/app/[locale]/chat/lib/config/constants";
import type { ChatMessage } from "@/app/api/[locale]/v1/core/agent/chat/hooks/store";
import {
  buildMessagePath,
  getDirectReplies,
  getRootMessages,
} from "@/app/[locale]/chat/lib/utils/thread-builder";
import { FlatMessageView } from "./flat-view/view";
import { LinearMessageView } from "./linear-view/view";
import { LoadingIndicator } from "./loading-indicator";
import { groupMessagesBySequence } from "./message-grouping";
import { ThreadedMessage } from "./threaded-view/view";

interface ChatMessagesProps {
  inputHeight?: number;
  locale: CountryLanguage;
  logger: EndpointLogger;
  currentUserId?: string;
}

export function ChatMessages({
  inputHeight = LAYOUT.DEFAULT_INPUT_HEIGHT,
  locale,
  logger,
  currentUserId,
}: ChatMessagesProps): JSX.Element {
  const chat = useChatContext();
  const {
    activeThread,
    activeThreadMessages,
    isLoading,
    viewMode,
    currentRootFolderId,
    branchIndices,
    collapseState,
  } = chat;
  const messagesContainerRef = useRef<DivRefObject>(null);
  const messagesEndRef = useRef<DivRefObject>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const lastMessageContentRef = useRef<string>("");
  const wasAtBottomBeforeStreamingRef = useRef<boolean>(true);
  const isStreamingRef = useRef<boolean>(false);
  const hasMountedRef = useRef<boolean>(false);
  const scrollAnimationFrameRef = useRef<number | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const userInteractingRef = useRef<boolean>(false);
  const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const lastThreadIdRef = useRef<string | null>(null);

  // Get streaming messages from AI stream store
  const streamingMessages = useAIStreamStore(
    (state) => state.streamingMessages,
  );

  // Merge streaming messages with persisted messages for instant UI updates
  const mergedMessages = useMemo(() => {
    const messageMap = new Map<string, ChatMessage>();

    // Add all persisted messages first
    for (const msg of activeThreadMessages) {
      messageMap.set(msg.id, msg);
    }

    // Get the current thread ID from the first persisted message
    // All persisted messages should have the same threadId since they're already filtered
    const currentThreadId = activeThreadMessages[0]?.threadId;

    // Override with streaming messages (they have the latest content)
    // IMPORTANT: Only merge streaming messages that belong to the current thread
    for (const streamMsg of Object.values(streamingMessages)) {
      // Skip streaming messages from other threads
      if (currentThreadId && streamMsg.threadId !== currentThreadId) {
        continue;
      }

      const existingMsg = messageMap.get(streamMsg.messageId);
      if (existingMsg) {
        // Update existing message with streaming content
        messageMap.set(streamMsg.messageId, {
          ...existingMsg,
          content: streamMsg.content,
          toolCalls: streamMsg.toolCalls,
        });
      } else {
        // Add new streaming message with all required fields
        messageMap.set(streamMsg.messageId, {
          id: streamMsg.messageId,
          threadId: streamMsg.threadId,
          role: streamMsg.role,
          content: streamMsg.content,
          parentId: streamMsg.parentId,
          depth: streamMsg.depth,
          model: streamMsg.model ?? null,
          persona: streamMsg.persona ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
          toolCalls: streamMsg.toolCalls,
          sequenceId: streamMsg.sequenceId ?? null,
          // Required fields with defaults
          authorId: null,
          authorName: null,
          isAI: streamMsg.role === "assistant",
          errorType: null,
          errorMessage: null,
          edited: false,
          tokens: null,
          upvotes: null,
          downvotes: null,
        });
      }
    }

    return [...messageMap.values()];
  }, [activeThreadMessages, streamingMessages]);

  // Check if user is at bottom of scroll
  const isAtBottom = useCallback((): boolean => {
    const container = messagesContainerRef.current;
    if (!container) {
      return true;
    }

    const threshold = 50; // pixels from bottom - smaller threshold for more precise detection
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, []);

  // Handle scroll events to detect user scrolling up
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    const handleScroll = (): void => {
      const atBottom = isAtBottom();
      const scrolledUp = !atBottom;

      setUserScrolledUp(scrolledUp);

      // If user scrolls back to bottom while streaming, re-enable auto-scroll
      if (!scrolledUp && isStreamingRef.current) {
        wasAtBottomBeforeStreamingRef.current = true;
        userInteractingRef.current = false;
      }
      // If user scrolls up while streaming, disable auto-scroll
      else if (scrolledUp && isStreamingRef.current) {
        wasAtBottomBeforeStreamingRef.current = false;
      }
    };

    // Detect user interaction (wheel, touch, keyboard)
    const handleUserInteraction = (): void => {
      userInteractingRef.current = true;

      // Clear existing timeout
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }

      // Reset interaction flag after 150ms of no interaction
      interactionTimeoutRef.current = setTimeout(() => {
        userInteractingRef.current = false;
      }, 150);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("wheel", handleUserInteraction, {
      passive: true,
    });
    container.addEventListener("touchstart", handleUserInteraction, {
      passive: true,
    });
    container.addEventListener("touchmove", handleUserInteraction, {
      passive: true,
    });
    container.addEventListener("keydown", handleUserInteraction, {
      passive: true,
    });

    return (): void => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleUserInteraction);
      container.removeEventListener("touchstart", handleUserInteraction);
      container.removeEventListener("touchmove", handleUserInteraction);
      container.removeEventListener("keydown", handleUserInteraction);

      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, [isAtBottom]);

  // Scroll to bottom on mount and when thread changes (not for public folder)
  useEffect(() => {
    const currentThreadId = activeThread?.id ?? null;
    const threadChanged = lastThreadIdRef.current !== currentThreadId;

    // Update the last thread ID
    lastThreadIdRef.current = currentThreadId;

    // Skip if already mounted and thread hasn't changed
    if (hasMountedRef.current && !threadChanged) {
      return;
    }

    // Mark as mounted
    hasMountedRef.current = true;

    // Don't auto-scroll for public folder
    if (currentRootFolderId === "public") {
      return;
    }

    // Scroll to bottom on initial mount or thread change with smooth animation
    if (activeThreadMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeThread?.id, activeThreadMessages, currentRootFolderId]);

  // Smart auto-scroll: only during streaming, only if user was at bottom, respect user scroll
  useEffect(() => {
    // Get the last message
    const allMessages = Object.values(activeThreadMessages);
    const lastMessage = allMessages[allMessages.length - 1];
    if (!lastMessage) {
      return;
    }

    // Check if content is actually changing (streaming)
    const contentChanged =
      lastMessage.content !== lastMessageContentRef.current;
    const isCurrentlyStreaming = isLoading && contentChanged;

    // Track streaming state changes
    const wasStreaming = isStreamingRef.current;
    isStreamingRef.current = isCurrentlyStreaming;

    // When streaming starts, capture if user is at bottom
    if (isCurrentlyStreaming && !wasStreaming) {
      wasAtBottomBeforeStreamingRef.current = !userScrolledUp;
    }

    // Reset when streaming stops
    if (!isCurrentlyStreaming && wasStreaming) {
      wasAtBottomBeforeStreamingRef.current = true;
    }

    lastMessageContentRef.current = lastMessage.content;

    // Only auto-scroll if:
    // 1. Currently streaming
    // 2. User was at bottom when streaming started
    // 3. User hasn't scrolled up since
    // 4. User is not actively interacting with scroll
    if (
      isCurrentlyStreaming &&
      wasAtBottomBeforeStreamingRef.current &&
      !userScrolledUp &&
      !userInteractingRef.current
    ) {
      // Cancel any pending scroll animation
      if (scrollAnimationFrameRef.current !== null) {
        cancelAnimationFrame(scrollAnimationFrameRef.current);
      }

      // Throttle scroll updates to smooth out fast and slow streams
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTimeRef.current;
      const minScrollInterval = 200; // Minimum 200ms between scrolls - increased for easier escape

      if (timeSinceLastScroll >= minScrollInterval) {
        // Scroll immediately if enough time has passed
        const container = messagesContainerRef.current;
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
          lastScrollTimeRef.current = now;
        }
      } else {
        // Schedule a scroll for later to avoid too frequent updates
        scrollAnimationFrameRef.current = requestAnimationFrame(() => {
          const container = messagesContainerRef.current;
          if (container && !userInteractingRef.current) {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: "smooth",
            });
            lastScrollTimeRef.current = Date.now();
          }
          scrollAnimationFrameRef.current = null;
        });
      }
    }

    // Cleanup on unmount
    return (): void => {
      if (scrollAnimationFrameRef.current !== null) {
        cancelAnimationFrame(scrollAnimationFrameRef.current);
      }
    };
  }, [activeThreadMessages, isLoading, userScrolledUp]);

  return (
    <Div
      ref={messagesContainerRef}
      id={DOM_IDS.MESSAGES_CONTAINER}
      className={cn(
        "h-full overflow-y-auto scroll-smooth",
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-400/30 hover:scrollbar-thumb-blue-500/50 scrollbar-thumb-rounded-full",
      )}
    >
      {/* Inner container with consistent padding and dynamic bottom padding */}
      {/* On native: no bottom padding needed since input is in normal flow */}
      <Div
        id={DOM_IDS.MESSAGES_CONTENT}
        style={
          envClient.platform.isReactNative
            ? { paddingBottom: LAYOUT.MESSAGES_BOTTOM_PADDING }
            : {
                paddingBottom: `${inputHeight + LAYOUT.MESSAGES_BOTTOM_PADDING}px`,
              }
        }
      >
        <Div className="max-w-3xl mx-auto px-4 sm:px-8 md:px-10 pt-35 md:pt-15 flex flex-col gap-5">
          {mergedMessages.length === 0 && !isLoading ? (
            <Div style={{ minHeight: `${LAYOUT.SUGGESTIONS_MIN_HEIGHT}vh` }}>
              <Div className="flex items-center justify-center h-full">
                {/* TODO add loading indicator */}
              </Div>
            </Div>
          ) : viewMode === "flat" ? (
            // Flat view (4chan style) - ALL messages in chronological order
            ((): JSX.Element | null => {
              // Get ALL messages from thread, sorted by timestamp
              const allMessages = mergedMessages.toSorted(
                (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
              );
              return activeThread ? (
                <FlatMessageView
                  thread={activeThread}
                  messages={allMessages}
                  locale={locale}
                  logger={logger}
                  onMessageClick={(messageId): void => {
                    // Scroll to message when reference is clicked
                    const element = document.getElementById(
                      `${DOM_IDS.MESSAGE_PREFIX}${messageId}`,
                    );
                    element?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  onInsertQuote={() => {
                    chat.setInput(chat.input + QUOTE_CHARACTER);
                    chat.inputRef.current?.focus();
                  }}
                  currentUserId={currentUserId}
                />
              ) : null;
            })()
          ) : viewMode === "threaded" ? (
            // Threaded view (Reddit style) - Show ALL messages, not just current path
            ((): JSX.Element[] => {
              // Group messages by sequence to filter out continuations
              const messageGroups = groupMessagesBySequence(mergedMessages);
              const messageToGroupMap = new Map<
                string,
                (typeof messageGroups)[0]
              >();
              for (const group of messageGroups) {
                messageToGroupMap.set(group.primary.id, group);
                for (const continuation of group.continuations) {
                  messageToGroupMap.set(continuation.id, group);
                }
              }

              // Filter out continuation messages for threading structure
              const primaryMessages = mergedMessages.filter((msg) => {
                const group = messageToGroupMap.get(msg.id);
                return !group || group.primary.id === msg.id;
              });

              const rootMessages = getRootMessages(primaryMessages, null);
              return rootMessages.map((rootMessage) => (
                <ThreadedMessage
                  key={rootMessage.id}
                  message={rootMessage}
                  messageGroup={messageToGroupMap.get(rootMessage.id)}
                  replies={getDirectReplies(primaryMessages, rootMessage.id)}
                  allMessages={primaryMessages}
                  messageToGroupMap={messageToGroupMap}
                  depth={0}
                  locale={locale}
                  logger={logger}
                  collapseState={collapseState}
                  currentUserId={currentUserId}
                />
              ));
            })()
          ) : (
            // Linear view (ChatGPT style) - Build path through message tree
            ((): JSX.Element => {
              const { path, branchInfo } = buildMessagePath(
                mergedMessages,
                branchIndices,
              );

              return (
                <LinearMessageView
                  messages={path}
                  branchInfo={branchInfo}
                  locale={locale}
                  logger={logger}
                  currentUserId={currentUserId}
                />
              );
            })()
          )}

          {/* Only show loading indicator if no messages exist yet */}
          {isLoading && mergedMessages.length === 0 && <LoadingIndicator />}

          <Div ref={messagesEndRef} />
        </Div>
      </Div>
    </Div>
  );
}
