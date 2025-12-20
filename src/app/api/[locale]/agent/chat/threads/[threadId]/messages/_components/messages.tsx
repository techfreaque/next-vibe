"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";
import { Logo } from "@/app/[locale]/_components/logo";
import {
  DOM_IDS,
  LAYOUT,
  QUOTE_CHARACTER,
} from "@/app/[locale]/chat/lib/config/constants";
import {
  buildMessagePath,
  getDirectReplies,
  getRootMessages,
} from "@/app/[locale]/chat/lib/utils/thread-builder";
import { useAIStreamStore } from "@/app/api/[locale]/agent/ai-stream/hooks/store";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { platform } from "@/config/env-client";
import type { CountryLanguage } from "@/i18n/core/config";
import type { DivRefObject } from "@/packages/next-vibe-ui/web/ui/div";

import { ViewMode } from "../../../../enum";
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
  /** Whether to show the branding logo (sticky inside scroll container) */
  showBranding?: boolean;
}

export function ChatMessages({
  inputHeight = LAYOUT.DEFAULT_INPUT_HEIGHT,
  locale,
  logger,
  currentUserId,
  showBranding = false,
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

  // Get streaming messages and streaming state from AI stream store
  const streamingMessages = useAIStreamStore(
    (state) => state.streamingMessages,
  );
  const isStreamingActive = useAIStreamStore((state) => state.isStreaming);

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
          sequenceId: streamMsg.sequenceId ?? null,
          // Required fields with defaults
          authorId: null,
          authorName: null,
          authorAvatar: null,
          authorColor: null,
          isAI: streamMsg.role === "assistant",
          errorType: null,
          errorMessage: null,
          errorCode: null,
          edited: false,
          originalId: null,
          tokens: null,
          metadata: {},
          upvotes: 0,
          downvotes: 0,
          searchVector: null,
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
    const lastMessage = allMessages.at(-1);
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
      {/* Sticky logo - inside scroll container for proper sticky behavior */}
      {/* Uses h-0 overflow-visible so it doesn't push content down on md+ (same line layout) */}
      {/* Below md: content has pt-20 to position below logo (separate line) */}
      {/* z-[1] so message editors (z-10+) appear above the logo */}
      {showBranding && (
        <Div className="sticky top-0 z-1 h-0 overflow-visible pointer-events-none">
          <Div className="max-w-3xl mx-auto px-4 sm:px-8 md:px-10 pt-15">
            <Div className="pointer-events-auto flex bg-background/20 backdrop-blur rounded-lg p-2 shadow-sm border border-border/20 w-fit">
              <Logo locale={locale} disabled size="h-10" />
            </Div>
          </Div>
        </Div>
      )}

      {/* Inner container with consistent padding and dynamic bottom padding */}
      {/* On native: no bottom padding needed since input is in normal flow */}
      <Div
        id={DOM_IDS.MESSAGES_CONTENT}
        style={
          platform.isReactNative
            ? { paddingBottom: LAYOUT.MESSAGES_BOTTOM_PADDING }
            : {
                paddingBottom: `${inputHeight + LAYOUT.MESSAGES_BOTTOM_PADDING}px`,
              }
        }
      >
        {/*
          Responsive top padding:
          - With branding (LINEAR view):
            - Below md: pt-35 (logo on separate line above)
            - md+: pt-15 (first message next to logo)
          - Without branding (FLAT/THREADED/DEBUG views):
            - pt-15 to clear the top toolbar
        */}
        <Div className={cn(
          "max-w-3xl mx-auto px-4 sm:px-8 md:px-10 flex flex-col gap-5",
          showBranding ? "pt-35 md:pt-15" : "pt-15"
        )}>
          {mergedMessages.length === 0 && !isLoading ? (
            <Div style={{ minHeight: `${LAYOUT.SUGGESTIONS_MIN_HEIGHT}vh` }}>
              <Div className="flex items-center justify-center h-full">
                {/* TODO add loading indicator */}
              </Div>
            </Div>
          ) : viewMode === ViewMode.FLAT ? (
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
                    const element = document.querySelector(
                      `#${CSS.escape(`${DOM_IDS.MESSAGE_PREFIX}${messageId}`)}`,
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
          ) : viewMode === ViewMode.THREADED ? (
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
                <ErrorBoundary key={rootMessage.id} locale={locale}>
                  <ThreadedMessage
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
                </ErrorBoundary>
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

          {/* Show loading indicator while streaming */}
          {isStreamingActive && <LoadingIndicator />}

          <Div ref={messagesEndRef} />
        </Div>
      </Div>
    </Div>
  );
}
