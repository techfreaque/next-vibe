"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";

import { useChatContext } from "../../features/chat/context";
import { DOM_IDS, LAYOUT, QUOTE_CHARACTER } from "../../lib/config/constants";
import type { ModelId } from "../../lib/config/models";
import type {
  ChatMessage,
  ChatThread,
  ViewMode,
} from "../../lib/storage/types";
import {
  getDirectReplies,
  getRootMessages,
} from "../../lib/utils/thread-builder";
import { FlatMessageView } from "./flat-message-view";
import { LinearMessageView } from "./linear-message-view";
import { LoadingIndicator } from "./loading-indicator";
import { SuggestedPrompts } from "./suggested-prompts";
import { ThreadedMessage } from "./threaded-message";
import { useMessageActions } from "./use-message-actions";

interface ChatMessagesProps {
  thread: ChatThread;
  messages: ChatMessage[];
  selectedModel: ModelId;
  selectedTone: string;
  ttsAutoplay: boolean;
  onEditMessage: (messageId: string, newContent: string) => Promise<void>;
  onDeleteMessage: (messageId: string) => void;
  onSwitchBranch: (messageId: string, branchIndex: number) => void;
  onModelChange?: (model: ModelId) => void;
  onToneChange?: (tone: string) => void;
  onBranchMessage?: (messageId: string, newContent: string) => Promise<void>;
  onRetryMessage?: (messageId: string) => Promise<void>;
  onAnswerAsModel?: (messageId: string) => Promise<void>;
  onVoteMessage?: (messageId: string, vote: 1 | -1 | 0) => void;
  isLoading?: boolean;
  showBranchIndicators?: boolean;
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
  selectedTone,
  ttsAutoplay,
  onEditMessage,
  onDeleteMessage,
  onSwitchBranch,
  onModelChange,
  onToneChange,
  onBranchMessage,
  onRetryMessage,
  onAnswerAsModel,
  onVoteMessage,
  isLoading = false,
  showBranchIndicators = true,
  onSendMessage,
  inputHeight = LAYOUT.DEFAULT_INPUT_HEIGHT,
  viewMode = "linear",
  rootFolderId = "general",
  locale,
  logger,
}: ChatMessagesProps): JSX.Element {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const lastMessageContentRef = useRef<string>("");

  // Use custom hook for message action state management
  const messageActions = useMessageActions(logger);

  // Get context for inserting text into input
  const { insertTextAtCursor } = useChatContext();

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
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) {
      return;
    }

    // Check if content is changing (streaming)
    const isStreaming =
      isLoading && lastMessage.content !== lastMessageContentRef.current;

    lastMessageContentRef.current = lastMessage.content;

    // Only auto-scroll during streaming or when new message arrives
    if (isStreaming || messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, userScrolledUp]);

  return (
    <div
      ref={messagesContainerRef}
      id={DOM_IDS.MESSAGES_CONTAINER}
      className={cn(
        "h-full overflow-y-auto scroll-smooth",
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-400/30 hover:scrollbar-thumb-blue-500/50 scrollbar-thumb-rounded-full",
      )}
    >
      {/* Inner container with consistent padding and dynamic bottom padding */}
      <div
        id={DOM_IDS.MESSAGES_CONTENT}
        className="max-w-3xl mx-auto px-4 sm:px-8 md:px-10 pt-15 space-y-5"
        style={{
          paddingBottom: `${inputHeight + LAYOUT.MESSAGES_BOTTOM_PADDING}px`,
        }}
      >
        {Object.keys(thread.messages).length === 0 &&
        !isLoading &&
        onSendMessage ? (
          <div
            className="flex items-center justify-center"
            style={{ minHeight: `${LAYOUT.SUGGESTIONS_MIN_HEIGHT}vh` }}
          >
            <SuggestedPrompts
              onSelectPrompt={onSendMessage}
              locale={locale}
              rootFolderId={rootFolderId}
            />
          </div>
        ) : viewMode === "flat" ? (
          // Flat view (4chan style) - ALL messages in chronological order
          ((): JSX.Element => {
            // Get ALL messages from thread, sorted by timestamp
            const allMessages = Object.values(thread.messages).sort(
              (a, b) => a.timestamp - b.timestamp,
            );
            return (
              <FlatMessageView
                thread={thread}
                messages={allMessages}
                selectedModel={selectedModel}
                selectedTone={selectedTone}
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
                onEditMessage={onEditMessage}
                onModelChange={onModelChange}
                onToneChange={onToneChange}
                onInsertQuote={() => {
                  insertTextAtCursor(QUOTE_CHARACTER);
                }}
              />
            );
          })()
        ) : viewMode === "threaded" ? (
          // Threaded view (Reddit style) - Show ALL messages, not just current path
          ((): JSX.Element[] => {
            const allMessages = Object.values(thread.messages);
            const rootMessages = getRootMessages(
              allMessages,
              thread.rootMessageId,
            );
            return rootMessages.map((rootMessage) => (
              <ThreadedMessage
                key={rootMessage.id}
                message={rootMessage}
                replies={getDirectReplies(allMessages, rootMessage.id)}
                allMessages={allMessages}
                depth={0}
                selectedModel={selectedModel}
                selectedTone={selectedTone}
                ttsAutoplay={ttsAutoplay}
                locale={locale}
                logger={logger}
                onEditMessage={onEditMessage}
                onDeleteMessage={onDeleteMessage}
                onBranchMessage={onBranchMessage}
                onRetryMessage={onRetryMessage}
                onAnswerAsModel={onAnswerAsModel}
                onVoteMessage={onVoteMessage}
                onModelChange={onModelChange}
                onToneChange={onToneChange}
              />
            ));
          })()
        ) : (
          // Linear view (ChatGPT style)
          <LinearMessageView
            thread={thread}
            messages={messages}
            selectedModel={selectedModel}
            selectedTone={selectedTone}
            showBranchIndicators={showBranchIndicators}
            ttsAutoplay={ttsAutoplay}
            locale={locale}
            editingMessageId={messageActions.editingMessageId}
            retryingMessageId={messageActions.retryingMessageId}
            answeringMessageId={messageActions.answeringMessageId}
            onEditMessage={onEditMessage}
            onDeleteMessage={onDeleteMessage}
            onSwitchBranch={onSwitchBranch}
            onBranchMessage={onBranchMessage}
            onRetryMessage={onRetryMessage}
            onAnswerAsModel={onAnswerAsModel}
            onModelChange={onModelChange}
            onToneChange={onToneChange}
            onStartEdit={messageActions.startEdit}
            onStartRetry={messageActions.startRetry}
            onStartAnswer={messageActions.startAnswer}
            onCancelAction={messageActions.cancelAction}
            onSaveEdit={(id, content) =>
              messageActions.handleSaveEdit(id, content, onEditMessage)
            }
            onBranchEdit={(id, content) =>
              messageActions.handleBranchEdit(id, content, onBranchMessage)
            }
            logger={logger}
          />
        )}

        {isLoading && <LoadingIndicator />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
