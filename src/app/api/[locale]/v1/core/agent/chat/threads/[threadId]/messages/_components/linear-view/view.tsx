/**
 * Linear Message View Component
 * Renders messages in a linear ChatGPT-style view with branch navigation
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";
import React, { useCallback } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ChatMessage } from "@/app/api/[locale]/v1/core/agent/chat/hooks/store";
import { useChatContext } from "@/app/api/[locale]/v1/core/agent/chat/hooks/context";
import { chatAnimations } from "@/app/[locale]/chat/lib/design-tokens";
import { BranchNavigator } from "../branch-navigator";
import { ErrorMessageBubble } from "../error-message-bubble";
import { GroupedAssistantMessage } from "../grouped-assistant-message";
import { MessageEditor } from "../message-editor";
import { groupMessagesBySequence } from "../message-grouping";
import { ModelPersonaSelectorModal } from "../model-persona-selector-modal";
import { UserMessageBubble } from "../user-message-bubble";

interface LinearMessageViewProps {
  messages: ChatMessage[];
  branchInfo: Record<string, { siblings: ChatMessage[]; currentIndex: number }>;
  locale: CountryLanguage;
  logger: EndpointLogger;
  currentUserId?: string;
}

export const LinearMessageView = React.memo(function LinearMessageView({
  messages,
  branchInfo,
  locale,
  logger,
  currentUserId,
}: LinearMessageViewProps): JSX.Element {
  // Get callbacks and editor actions from context
  const {
    currentRootFolderId: rootFolderId,
    handleDeleteMessage: onDeleteMessage,
    retryMessage: onRetryMessage,
    answerAsAI: onAnswerAsModel,
    handleModelChange: onModelChange,
    setSelectedPersona: onPersonaChange,
    handleSwitchBranch: onSwitchBranch,
    branchMessage,
    // Editor actions
    editingMessageId,
    retryingMessageId,
    answeringMessageId,
    answerContent,
    startEdit: onStartEdit,
    startRetry: onStartRetry,
    startAnswer: onStartAnswer,
    cancelEditorAction: onCancelAction,
    handleBranchEdit: onBranchEdit,
    setAnswerContent: onSetAnswerContent,
    // Collapse state
    collapseState,
  } = useChatContext();

  // Wrap handleBranchEdit to pass branchMessage as the third parameter
  const handleBranch = useCallback(
    async (messageId: string, content: string) => {
      await onBranchEdit(messageId, content, branchMessage);
    },
    [onBranchEdit, branchMessage],
  );

  // Group messages by sequence for proper display
  const messageGroups = groupMessagesBySequence(messages);

  // Create a map of message IDs to their groups for quick lookup
  const messageToGroupMap = new Map<string, (typeof messageGroups)[0]>();
  for (const group of messageGroups) {
    messageToGroupMap.set(group.primary.id, group);
    for (const continuation of group.continuations) {
      messageToGroupMap.set(continuation.id, group);
    }
  }

  // Check for root-level branches (multiple root messages)
  const rootBranches = branchInfo["__root__"];
  const hasRootBranches = rootBranches && rootBranches.siblings.length > 1;

  return (
    <>
      {/* Show root-level branch navigator if there are multiple root messages */}
      {hasRootBranches && (
        <Div className="md:flex md:justify-end">
          <Div className="mb-3 md:w-[75%]">
            <BranchNavigator
              currentBranchIndex={rootBranches.currentIndex}
              totalBranches={rootBranches.siblings.length}
              branches={rootBranches.siblings.map((sibling) => ({
                id: sibling.id,
                preview:
                  sibling.content.slice(0, 50) +
                  (sibling.content.length > 50 ? "..." : ""),
              }))}
              onSwitchBranch={(index) =>
                // eslint-disable-next-line i18next/no-literal-string
                onSwitchBranch("__root__", index)
              }
              locale={locale}
            />
          </Div>
        </Div>
      )}

      {messages.map((message, index) => {
        const isEditing = editingMessageId === message.id;
        const isRetrying = retryingMessageId === message.id;
        const isAnswering = answeringMessageId === message.id;

        // Check if this message has branches (multiple children)
        const branches = branchInfo[message.id];
        const hasBranches = branches && branches.siblings.length > 1;

        // Get the next message in the path (the child we're following)
        const nextMessage =
          index < messages.length - 1 ? messages[index + 1] : null;

        // Check if this is a continuation message (part of a sequence but not the primary)
        const group = messageToGroupMap.get(message.id);
        const isContinuation = group && group.primary.id !== message.id;

        // Skip rendering continuation messages - they'll be rendered with their primary
        if (isContinuation) {
          return null;
        }

        return (
          <React.Fragment key={message.id}>
            <Div className={cn(chatAnimations.slideIn, "group")}>
              {isEditing ? (
                <Div className="flex justify-end">
                  <MessageEditor
                    message={message}
                    onBranch={handleBranch}
                    onCancel={onCancelAction}
                    onModelChange={onModelChange}
                    onPersonaChange={onPersonaChange}
                    locale={locale}
                    logger={logger}
                  />
                </Div>
              ) : isRetrying ? (
                <Div className="flex justify-end">
                  <ModelPersonaSelectorModal
                    titleKey="app.chat.linearMessageView.retryModal.title"
                    descriptionKey="app.chat.linearMessageView.retryModal.description"
                    onModelChange={
                      onModelChange ||
                      ((): void => {
                        /* no-op */
                      })
                    }
                    onPersonaChange={
                      onPersonaChange ||
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
                </Div>
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
                      showAuthor={rootFolderId === "public"}
                      rootFolderId={rootFolderId}
                      currentUserId={currentUserId}
                    />
                  )}
                  {(message.role === "assistant" || message.role === "tool") &&
                    group && (
                      <GroupedAssistantMessage
                        group={group}
                        locale={locale}
                        onAnswerAsModel={onStartAnswer}
                        onDelete={onDeleteMessage}
                        showAuthor={true}
                        logger={logger}
                        collapseState={collapseState}
                      />
                    )}
                  {message.role === "error" && (
                    <ErrorMessageBubble message={message} />
                  )}
                </>
              )}
            </Div>

            {/* Show Answer-as-AI dialog below the message */}
            {isAnswering && (
              <Div className="my-3">
                <ModelPersonaSelectorModal
                  titleKey="app.chat.linearMessageView.answerModal.title"
                  descriptionKey="app.chat.linearMessageView.answerModal.description"
                  onModelChange={
                    onModelChange ||
                    ((): void => {
                      /* no-op */
                    })
                  }
                  onPersonaChange={
                    onPersonaChange ||
                    ((): void => {
                      /* no-op */
                    })
                  }
                  showInput={true}
                  inputValue={answerContent}
                  onInputChange={onSetAnswerContent}
                  inputPlaceholderKey="app.chat.linearMessageView.answerModal.inputPlaceholder"
                  onConfirm={async (): Promise<void> => {
                    if (onAnswerAsModel) {
                      await onAnswerAsModel(message.id, answerContent);
                    }
                    onCancelAction();
                  }}
                  onCancel={onCancelAction}
                  confirmLabelKey="app.chat.linearMessageView.answerModal.confirmLabel"
                  locale={locale}
                  logger={logger}
                />
              </Div>
            )}

            {/* Show branch navigator if this message has multiple children */}
            {hasBranches && nextMessage && (
              <Div className="my-3">
                <BranchNavigator
                  currentBranchIndex={branches.currentIndex}
                  totalBranches={branches.siblings.length}
                  branches={branches.siblings.map((sibling) => ({
                    id: sibling.id,
                    preview:
                      sibling.content.slice(0, 50) +
                      (sibling.content.length > 50 ? "..." : ""),
                  }))}
                  onSwitchBranch={(index) => onSwitchBranch(message.id, index)}
                  locale={locale}
                />
              </Div>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
});
