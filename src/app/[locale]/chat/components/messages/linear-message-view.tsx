/**
 * Linear Message View Component
 * Renders messages in a linear ChatGPT-style view with branch navigation
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React from "react";

import type { ModelId } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";

import { chatAnimations } from "../../lib/design-tokens";
import type { ChatMessage } from "../../types";
import { AssistantMessageBubble } from "./assistant-message-bubble";
import { ErrorMessageBubble } from "./error-message-bubble";
import { MessageEditor } from "./message-editor";
import { ModelPersonaSelectorModal } from "./model-persona-selector-modal";
import { UserMessageBubble } from "./user-message-bubble";

interface LinearMessageViewProps {
  messages: ChatMessage[];
  selectedModel: ModelId;
  selectedTone: string;
  ttsAutoplay: boolean;
  locale: CountryLanguage;

  // Action states
  editingMessageId: string | null;
  retryingMessageId: string | null;
  answeringMessageId: string | null;

  // Action handlers
  onEditMessage: (messageId: string, newContent: string) => Promise<void>;
  onDeleteMessage: (messageId: string) => void;
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
  messages,
  selectedModel,
  selectedTone,
  ttsAutoplay,
  locale,
  editingMessageId,
  retryingMessageId,
  answeringMessageId,
  onDeleteMessage,
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

            {/* Branch navigation disabled in new architecture - branches are handled differently */}
          </div>
        );
      })}
    </>
  );
}
