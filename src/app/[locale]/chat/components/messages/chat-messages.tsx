"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui";
import type { JSX } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import type { UseChatReturn } from "@/app/api/[locale]/v1/core/agent/chat/hooks";
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
import { SuggestedPrompts } from "./suggested-prompts";
import { ThreadedMessage } from "./threaded-message";
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
  rootFolderId?: string;
  locale: CountryLanguage;
  logger: EndpointLogger;
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
  rootFolderId = "general",
  locale,
  logger,
  chat,
}: ChatMessagesProps): JSX.Element {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const lastMessageContentRef = useRef<string>("");

  // Use custom hook for message action state management
  const messageActions = useMessageActions(logger);

  // Check if user is at bottom of scroll
  const isAtBottom = useCallback((): boolean => {
    const container = messagesContainerRef.current;
    if (!container) {
      return true;
    }

    const threshold = 100; // pixels from bottom
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
      setUserScrolledUp(!atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return (): void => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [isAtBottom]);

  // Smart auto-scroll: only during streaming, respect user scroll position
  useEffect(() => {
    // Don't auto-scroll if user has scrolled up
    if (userScrolledUp) {
      return;
    }

    // Get the last message
    const allMessages = Object.values(messages);
    const lastMessage = allMessages[allMessages.length - 1];
    if (!lastMessage) {
      return;
    }

    // Check if content is changing (streaming)
    const isStreaming =
      isLoading && lastMessage.content !== lastMessageContentRef.current;

    lastMessageContentRef.current = lastMessage.content;

    // Only auto-scroll during streaming or when new message arrives
    if (isStreaming || allMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
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
        {Object.keys(messages).length === 0 && !isLoading && onSendMessage ? (
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
            const allMessages = Object.values(messages).sort(
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
              />
            );
          })()
        ) : viewMode === "threaded" ? (
          // Threaded view (Reddit style) - Show ALL messages, not just current path
          ((): JSX.Element[] => {
            const allMessages = Object.values(messages);
            const rootMessages = getRootMessages(allMessages, null);
            return rootMessages.map((rootMessage) => (
              <ThreadedMessage
                key={rootMessage.id}
                message={rootMessage}
                replies={getDirectReplies(allMessages, rootMessage.id)}
                allMessages={allMessages}
                depth={0}
                selectedModel={selectedModel}
                selectedPersona={selectedPersona}
                ttsAutoplay={ttsAutoplay}
                locale={locale}
                logger={logger}
                onDeleteMessage={onDeleteMessage}
                onBranchMessage={onBranchMessage}
                onRetryMessage={onRetryMessage}
                onAnswerAsModel={onAnswerAsModel}
                onVoteMessage={onVoteMessage}
                onModelChange={onModelChange}
                onPersonaChange={onPersonaChange}
                rootFolderId={rootFolderId}
              />
            ));
          })()
        ) : (
          // Linear view (ChatGPT style) - Build path through message tree
          ((): JSX.Element => {
            const allMessages = Object.values(messages);
            const { path, branchInfo } = buildMessagePath(
              allMessages,
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
              />
            );
          })()
        )}

        {isLoading && <LoadingIndicator />}

        <Div ref={messagesEndRef} />
      </Div>
    </Div>
  );
}
