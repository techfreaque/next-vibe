"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React, { useEffect, useRef } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { useChatContext } from "../../features/chat/context";
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
  onEditMessage: (messageId: string, newContent: string) => Promise<void>;
  onDeleteMessage: (messageId: string) => void;
  onSwitchBranch: (messageId: string, branchIndex: number) => void;
  onModelChange?: (model: ModelId) => void;
  onToneChange?: (tone: string) => void;
  onBranchMessage?: (messageId: string, newContent: string) => Promise<void>;
  onRetryMessage?: (messageId: string) => Promise<void>;
  onAnswerAsModel?: (messageId: string) => Promise<void>;
  isLoading?: boolean;
  showBranchIndicators?: boolean;
  onSendMessage?: (content: string) => void;
  inputHeight?: number;
  viewMode?: ViewMode;
  locale: CountryLanguage;
}

export function ChatMessages({
  thread,
  messages,
  selectedModel,
  selectedTone,
  onEditMessage,
  onDeleteMessage,
  onSwitchBranch,
  onModelChange,
  onToneChange,
  onBranchMessage,
  onRetryMessage,
  onAnswerAsModel,
  isLoading = false,
  showBranchIndicators = true,
  onSendMessage,
  inputHeight = 120,
  viewMode = "linear",
}: ChatMessagesProps): JSX.Element {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use custom hook for message action state management
  const messageActions = useMessageActions();

  // Get context for inserting text into input
  const { insertTextAtCursor } = useChatContext();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div
      ref={messagesContainerRef}
      id="chat-messages-container"
      className={cn(
        "h-full overflow-y-auto scroll-smooth",
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-400/30 hover:scrollbar-thumb-blue-500/50 scrollbar-thumb-rounded-full",
      )}
    >
      {/* Inner container with consistent padding and dynamic bottom padding */}
      <div
        id="chat-messages-content"
        className="max-w-3xl mx-auto px-4 sm:px-8 md:px-10 pt-15 space-y-5"
        style={{ paddingBottom: `${inputHeight + 16}px` }}
      >
        {Object.keys(thread.messages).length === 0 &&
        !isLoading &&
        onSendMessage ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <SuggestedPrompts onSelectPrompt={onSendMessage} />
          </div>
        ) : viewMode === "flat" ? (
          // Flat view (4chan style) - ALL messages in chronological order
          (() => {
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
                onMessageClick={(messageId) => {
                  // Scroll to message when reference is clicked
                  const element = document.getElementById(`msg-${messageId}`);
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
                  // Only insert '>' character for quoting
                  insertTextAtCursor(">");
                }}
              />
            );
          })()
        ) : viewMode === "threaded" ? (
          // Threaded view (Reddit style) - Show ALL messages, not just current path
          (() => {
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
                onEditMessage={onEditMessage}
                onDeleteMessage={onDeleteMessage}
                onBranchMessage={onBranchMessage}
                onRetryMessage={onRetryMessage}
                onAnswerAsModel={onAnswerAsModel}
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
          />
        )}

        {isLoading && <LoadingIndicator />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
