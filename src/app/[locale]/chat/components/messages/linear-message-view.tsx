/**
 * Linear Message View Component
 * Renders messages in a linear ChatGPT-style view with branch navigation
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ModelId } from "../../lib/config/models";
import { chatAnimations } from "../../lib/design-tokens";
import { getBranchInfo } from "../../lib/storage/message-tree";
import type { ChatMessage, ChatThread } from "../../lib/storage/types";
import { AssistantMessageBubble } from "./assistant-message-bubble";
import { BranchNavigator } from "./branch-navigator";
import { ErrorMessageBubble } from "./error-message-bubble";
import { MessageEditor } from "./message-editor";
import { ModelPersonaSelectorModal } from "./model-persona-selector-modal";
import { UserMessageBubble } from "./user-message-bubble";

interface LinearMessageViewProps {
  thread: ChatThread;
  messages: ChatMessage[];
  selectedModel: ModelId;
  selectedTone: string;
  showBranchIndicators: boolean;
  ttsAutoplay: boolean;
  locale: CountryLanguage;

  // Action states
  editingMessageId: string | null;
  retryingMessageId: string | null;
  answeringMessageId: string | null;

  // Action handlers
  onEditMessage: (messageId: string, newContent: string) => Promise<void>;
  onDeleteMessage: (messageId: string) => void;
  onSwitchBranch: (messageId: string, branchIndex: number) => void;
  onBranchMessage?: (messageId: string, newContent: string) => Promise<void>;
  onRetryMessage?: (messageId: string) => Promise<void>;
  onAnswerAsModel?: (messageId: string) => Promise<void>;
  onModelChange?: (model: ModelId) => void;
  onToneChange?: (tone: string) => void;

  // UI handlers
  onStartEdit: (messageId: string) => void;
  onStartRetry: (messageId: string) => void;
  onStartAnswer: (messageId: string) => void;
  onCancelAction: () => void;
  onSaveEdit: (messageId: string, content: string) => Promise<void>;
  onBranchEdit: (messageId: string, content: string) => Promise<void>;

  logger: EndpointLogger;
}

export function LinearMessageView({
  thread,
  messages,
  selectedModel,
  selectedTone,
  showBranchIndicators,
  ttsAutoplay,
  locale,
  editingMessageId,
  retryingMessageId,
  answeringMessageId,
  onDeleteMessage,
  onSwitchBranch,
  onRetryMessage,
  onAnswerAsModel,
  onModelChange,
  onToneChange,
  onStartEdit,
  onStartRetry,
  onStartAnswer,
  onCancelAction,
  onSaveEdit,
  onBranchEdit,
  logger,
}: LinearMessageViewProps): JSX.Element {
  return (
    <>
      {messages.map((message) => {
        const branchInfo = getBranchInfo(thread, message.id);
        const showBranches = showBranchIndicators && branchInfo.hasBranches;
        const isEditing = editingMessageId === message.id;
        const isRetrying = retryingMessageId === message.id;
        const isAnswering = answeringMessageId === message.id;

        return (
          <div key={message.id} className={cn(chatAnimations.slideIn, "group")}>
            {isEditing ? (
              <div className="flex justify-end">
                <MessageEditor
                  message={message}
                  selectedModel={selectedModel}
                  selectedTone={selectedTone}
                  onSave={onSaveEdit}
                  onCancel={onCancelAction}
                  onModelChange={onModelChange}
                  onToneChange={onToneChange}
                  onBranch={onBranchEdit}
                  locale={locale}
                  logger={logger}
                />
              </div>
            ) : isRetrying ? (
              <div className="flex justify-end">
                <ModelPersonaSelectorModal
                  titleKey="app.chat.linearMessageView.retryModal.title"
                  descriptionKey="app.chat.linearMessageView.retryModal.description"
                  selectedModel={selectedModel}
                  selectedTone={selectedTone}
                  onModelChange={
                    onModelChange ||
                    ((): void => {
                      /* no-op */
                    })
                  }
                  onToneChange={
                    onToneChange ||
                    ((): void => {
                      /* no-op */
                    })
                  }
                  onConfirm={(): void => {
                    if (onRetryMessage) {
                      void onRetryMessage(message.id);
                    }
                    onCancelAction();
                  }}
                  onCancel={onCancelAction}
                  confirmLabelKey="app.chat.linearMessageView.retryModal.confirmLabel"
                  locale={locale}
                  logger={logger}
                />
              </div>
            ) : isAnswering ? (
              <ModelPersonaSelectorModal
                titleKey="app.chat.linearMessageView.answerModal.title"
                descriptionKey="app.chat.linearMessageView.answerModal.description"
                selectedModel={selectedModel}
                selectedTone={selectedTone}
                onModelChange={
                  onModelChange ||
                  ((): void => {
                    /* no-op */
                  })
                }
                onToneChange={
                  onToneChange ||
                  ((): void => {
                    /* no-op */
                  })
                }
                onConfirm={(): void => {
                  if (onAnswerAsModel) {
                    void onAnswerAsModel(message.id);
                  }
                  onCancelAction();
                }}
                onCancel={onCancelAction}
                confirmLabelKey="app.chat.linearMessageView.answerModal.confirmLabel"
                locale={locale}
                logger={logger}
              />
            ) : (
              <>
                {message.role === "user" && (
                  <UserMessageBubble
                    message={message}
                    locale={locale}
                    logger={logger}
                    onBranch={onStartEdit}
                    onRetry={onStartRetry}
                    onDelete={onDeleteMessage}
                    showAuthor={true}
                  />
                )}
                {message.role === "assistant" && (
                  <AssistantMessageBubble
                    message={message}
                    ttsAutoplay={ttsAutoplay}
                    locale={locale}
                    onAnswerAsModel={onStartAnswer}
                    onDelete={onDeleteMessage}
                    showAuthor={true}
                    logger={logger}
                  />
                )}
                {message.role === "error" && (
                  <ErrorMessageBubble message={message} />
                )}
              </>
            )}

            {showBranches && !isEditing && (
              <div className="mt-3 ml-12">
                <BranchNavigator
                  currentBranchIndex={branchInfo.currentBranchIndex}
                  totalBranches={branchInfo.branchCount}
                  branches={branchInfo.branches}
                  onSwitchBranch={(index): void =>
                    onSwitchBranch(message.id, index)
                  }
                  locale={locale}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
