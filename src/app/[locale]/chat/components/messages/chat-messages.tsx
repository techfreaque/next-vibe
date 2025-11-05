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

import { useAIStreamStore } from "@/app/api/[locale]/v1/core/agent/ai-stream/hooks/store";
import type { DefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
import type { UseChatReturn } from "@/app/api/[locale]/v1/core/agent/chat/hooks/hooks";
import type { ModelId } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { DOM_IDS, LAYOUT, QUOTE_CHARACTER } from "../../lib/config/constants";
import {
  buildMessagePath,
  getDirectReplies,
  getRootMessages,
} from "../../lib/utils/thread-builder";
import type { ChatMessage, ChatThread, ViewMode } from "../../types";
import { FlatMessageView } from "./flat-message-view";
import { LinearMessageView } from "./linear-message-view";
import { LoadingIndicator } from "./loading-indicator";
import { groupMessagesBySequence } from "./message-grouping";
import { SuggestedPrompts } from "./suggested-prompts";
import { ThreadedMessage } from "./threaded-message";
import { useCollapseState } from "./use-collapse-state";
import { useMessageActions } from "./use-message-actions";

interface ChatMessagesProps {
  chat: UseChatReturn;
  thread: ChatThread;
  messages: ChatMessage[];
  selectedModel: ModelId;
  selectedPersona: string;
  ttsAutoplay: boolean;
  onDeleteMessage: (messageId: string) => void;
  onSwitchBranch: (messageId: string, branchIndex: number) => void;
  onModelChange?: (model: ModelId) => void;
  onPersonaChange?: (persona: string) => void;
  onBranchMessage?: (messageId: string, newContent: string) => Promise<void>;
  onRetryMessage?: (messageId: string) => Promise<void>;
  onAnswerAsModel?: (messageId: string, content: string) => Promise<void>;
  onVoteMessage?: (messageId: string, vote: 1 | -1 | 0) => void;
  isLoading?: boolean;
  showBranchIndicators?: boolean;
  branchIndices?: Record<string, number>;
  onSendMessage?: (
    prompt: string,
    personaId: string,
    modelId?: ModelId,
  ) => void;
  inputHeight?: number;
  viewMode?: ViewMode;
  rootFolderId: DefaultFolderId;
  locale: CountryLanguage;
  logger: EndpointLogger;
  currentUserId?: string;
}

export function ChatMessages({
  thread,
  messages,
  selectedModel,
  selectedPersona,
  ttsAutoplay,
  onDeleteMessage,
  onSwitchBranch,
  onModelChange,
  onPersonaChange,
  onBranchMessage,
  onRetryMessage,
  onAnswerAsModel,
  onVoteMessage,
  isLoading = false,
  branchIndices = {},
  onSendMessage,
  inputHeight = LAYOUT.DEFAULT_INPUT_HEIGHT,
  viewMode = "linear",
  rootFolderId = "private",
  locale,
  logger,
  chat,
  currentUserId,
}: ChatMessagesProps): JSX.Element {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  // Use custom hook for message action state management
  const messageActions = useMessageActions(logger);

  // Collapse state management for thinking/tool sections
  const collapseState = useCollapseState();

  // Get streaming messages from AI stream store
  const streamingMessages = useAIStreamStore(
    (state) => state.streamingMessages,
  );

  // Merge streaming messages with persisted messages for instant UI updates
  const mergedMessages = useMemo(() => {
    const messageMap = new Map<string, ChatMessage>();

    // Add all persisted messages first
    for (const msg of messages) {
      messageMap.set(msg.id, msg);
    }

    // Override with streaming messages (they have the latest content)
    for (const streamMsg of Object.values(streamingMessages)) {
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
          sequenceIndex: streamMsg.sequenceIndex ?? 0,
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
  }, [messages, streamingMessages]);

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
    const currentThreadId = thread?.id ?? null;
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
    if (rootFolderId === "public") {
      return;
    }

    // Scroll to bottom on initial mount or thread change with smooth animation
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [thread?.id, messages, rootFolderId]);

  // Smart auto-scroll: only during streaming, only if user was at bottom, respect user scroll
  useEffect(() => {
    // Get the last message
    const allMessages = Object.values(messages);
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
  }, [messages, isLoading, userScrolledUp]);

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
      <Div
        id={DOM_IDS.MESSAGES_CONTENT}
        className="max-w-3xl mx-auto px-4 sm:px-8 md:px-10 pt-15 space-y-5"
        style={{
          paddingBottom: `${inputHeight + LAYOUT.MESSAGES_BOTTOM_PADDING}px`,
        }}
      >
        {mergedMessages.length === 0 && !isLoading && onSendMessage ? (
          <Div
            className="flex items-center justify-center"
            style={{ minHeight: `${LAYOUT.SUGGESTIONS_MIN_HEIGHT}vh` }}
          >
            <SuggestedPrompts
              onSelectPrompt={onSendMessage}
              locale={locale}
              rootFolderId={rootFolderId}
            />
          </Div>
        ) : viewMode === "flat" ? (
          // Flat view (4chan style) - ALL messages in chronological order
          ((): JSX.Element => {
            // Get ALL messages from thread, sorted by timestamp
            const allMessages = mergedMessages.toSorted(
              (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
            );
            return (
              <FlatMessageView
                thread={thread}
                messages={allMessages}
                personas={chat.personas}
                selectedModel={selectedModel}
                selectedPersona={selectedPersona}
                ttsAutoplay={ttsAutoplay}
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
                onBranchMessage={onBranchMessage}
                onRetryMessage={onRetryMessage}
                onAnswerAsModel={onAnswerAsModel}
                onDeleteMessage={onDeleteMessage}
                onModelChange={onModelChange}
                onPersonaChange={onPersonaChange}
                onInsertQuote={() => {
                  chat.setInput(chat.input + QUOTE_CHARACTER);
                  chat.inputRef.current?.focus();
                }}
                rootFolderId={rootFolderId}
                currentUserId={currentUserId}
                deductCredits={chat.deductCredits}
              />
            );
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
                selectedModel={selectedModel}
                selectedPersona={selectedPersona}
                ttsAutoplay={ttsAutoplay}
                locale={locale}
                logger={logger}
                onDeleteMessage={onDeleteMessage}
                collapseState={collapseState}
                onBranchMessage={onBranchMessage}
                onRetryMessage={onRetryMessage}
                onAnswerAsModel={onAnswerAsModel}
                onVoteMessage={onVoteMessage}
                onModelChange={onModelChange}
                onPersonaChange={onPersonaChange}
                currentUserId={currentUserId}
                deductCredits={chat.deductCredits}
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
                selectedModel={selectedModel}
                selectedPersona={selectedPersona}
                ttsAutoplay={ttsAutoplay}
                locale={locale}
                editingMessageId={messageActions.editingMessageId}
                retryingMessageId={messageActions.retryingMessageId}
                answeringMessageId={messageActions.answeringMessageId}
                answerContent={messageActions.answerContent}
                onDeleteMessage={onDeleteMessage}
                onRetryMessage={onRetryMessage}
                onAnswerAsModel={onAnswerAsModel}
                onSetAnswerContent={messageActions.setAnswerContent}
                onModelChange={onModelChange}
                onPersonaChange={onPersonaChange}
                onStartEdit={messageActions.startEdit}
                onStartRetry={messageActions.startRetry}
                onStartAnswer={messageActions.startAnswer}
                onCancelAction={messageActions.cancelAction}
                onBranchEdit={(id, content) =>
                  messageActions.handleBranchEdit(id, content, onBranchMessage)
                }
                onSwitchBranch={onSwitchBranch}
                logger={logger}
                rootFolderId={rootFolderId}
                currentUserId={currentUserId}
                deductCredits={chat.deductCredits}
              />
            );
          })()
        )}

        {/* Only show loading indicator if no messages exist yet */}
        {isLoading && mergedMessages.length === 0 && <LoadingIndicator />}

        <Div ref={messagesEndRef} />
      </Div>
    </Div>
  );
}
