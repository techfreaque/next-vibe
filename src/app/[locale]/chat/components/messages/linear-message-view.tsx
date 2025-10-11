/**
 * Linear Message View Component
 * Renders messages in a linear ChatGPT-style view with branch navigation
 */

"use client";

import type { JSX } from "react";
import React from "react";

import type { ChatMessage, ChatThread } from "../../lib/storage/types";
import type { ModelId } from "../../lib/config/models";
import { getBranchInfo } from "../../lib/storage/message-tree";
import { BranchNavigator } from "./branch-navigator";
import { UserMessageBubble } from "./user-message-bubble";
import { AssistantMessageBubble } from "./assistant-message-bubble";
import { ErrorMessageBubble } from "./error-message-bubble";
import { MessageEditor } from "./message-editor";
import { ModelPersonaSelectorModal } from "./model-persona-selector-modal";
import { chatAnimations } from "../../lib/design-tokens";
import { cn } from "next-vibe/shared/utils";

interface LinearMessageViewProps {
  thread: ChatThread;
  messages: ChatMessage[];
  selectedModel: ModelId;
  selectedTone: string;
  showBranchIndicators: boolean;
  
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
}

export function LinearMessageView({
  thread,
  messages,
  selectedModel,
  selectedTone,
  showBranchIndicators,
  editingMessageId,
  retryingMessageId,
  answeringMessageId,
  onEditMessage,
  onDeleteMessage,
  onSwitchBranch,
  onBranchMessage,
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
                />
              </div>
            ) : isRetrying ? (
              <div className="flex justify-end">
                <ModelPersonaSelectorModal
                  title="Retry with Different Settings"
                  description="Choose a model and persona to regenerate the response"
                  selectedModel={selectedModel}
                  selectedTone={selectedTone}
                  onModelChange={onModelChange || (() => {})}
                  onToneChange={onToneChange || (() => {})}
                  onConfirm={() => {
                    if (onRetryMessage) {
                      onRetryMessage(message.id);
                    }
                    onCancelAction();
                  }}
                  onCancel={onCancelAction}
                  confirmLabel="Retry"
                />
              </div>
            ) : isAnswering ? (
              <ModelPersonaSelectorModal
                title="Answer as AI Model"
                description="Choose a model and persona to generate an AI response"
                selectedModel={selectedModel}
                selectedTone={selectedTone}
                onModelChange={onModelChange || (() => {})}
                onToneChange={onToneChange || (() => {})}
                onConfirm={() => {
                  if (onAnswerAsModel) {
                    onAnswerAsModel(message.id);
                  }
                  onCancelAction();
                }}
                onCancel={onCancelAction}
                confirmLabel="Generate"
              />
            ) : (
              <>
                {message.role === "user" && (
                  <UserMessageBubble
                    message={message}
                    onBranch={onStartEdit}
                    onRetry={onStartRetry}
                    onDelete={onDeleteMessage}
                  />
                )}
                {message.role === "assistant" && (
                  <AssistantMessageBubble
                    message={message}
                    onAnswerAsModel={onStartAnswer}
                    onDelete={onDeleteMessage}
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
                  onSwitchBranch={(index) => onSwitchBranch(message.id, index)}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

