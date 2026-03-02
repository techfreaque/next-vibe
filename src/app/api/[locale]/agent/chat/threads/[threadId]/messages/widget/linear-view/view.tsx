/**
 * Linear Message View Component
 * Renders messages in a linear ChatGPT-style view with branch navigation
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Markdown } from "next-vibe-ui/ui/markdown";
import type { JSX } from "react";
import React, { useMemo } from "react";

import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";
import {
  chatAnimations,
  chatProse,
  chatShadows,
} from "@/app/[locale]/chat/lib/design-tokens";
import { createMetadataSystemMessage } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/message-metadata";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { ChatMessageRole, ViewMode } from "@/app/api/[locale]/agent/chat/enum";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { BRANCH_INDEX_KEY } from "../../../../../hooks/use-branch-management";
import type { SendMessageParams } from "../../hooks/operations/send-message";
import type { CollapseStateStore } from "../../hooks/use-collapse-state";
import { BranchNavigator } from "../branch-navigator";
import { DebugSystemPrompt, DebugTrailingContext } from "../debug-component";
import { ErrorMessageBubble } from "../error-message-bubble";
import { GroupedAssistantMessage } from "../grouped-assistant-message";
import { MessageAuthorInfo } from "../message-author";
import { MessageEditor } from "../message-editor";
import { groupMessagesBySequence } from "../message-grouping";
import { ModelCharacterSelectorModal } from "../model-character-selector-modal";
import { UserMessageBubble } from "../user-message-bubble";

interface LinearMessageViewProps {
  messages: ChatMessage[];
  branchInfo: Record<string, { siblings: ChatMessage[]; currentIndex: number }>;
  locale: CountryLanguage;
  logger: EndpointLogger;
  currentUserId: string | null;
  user: JwtPayloadType;
  viewMode: (typeof ViewMode)[keyof typeof ViewMode];
  collapseState: CollapseStateStore | null;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
  onDeleteMessage: ((messageId: string) => void) | null;
  onRetryMessage:
    | ((messageId: string, attachments?: File[]) => Promise<void>)
    | null;
  onSwitchBranch: ((parentId: string, index: number) => void) | null;
  onBranchMessage:
    | ((
        messageId: string,
        content: string,
        audioInput: { file: File } | undefined,
        attachments: File[] | undefined,
      ) => Promise<void>)
    | null;
  onStartEdit: ((messageId: string) => void) | null;
  onStartRetry: ((messageId: string) => void) | null;
  onStartAnswer: ((messageId: string) => void) | null;
  answerAsAI:
    | ((
        messageId: string,
        content: string,
        attachments: File[] | undefined,
      ) => Promise<void>)
    | null;
  onCancelAction: (() => void) | null;
  editingMessageId: string | null;
  retryingMessageId: string | null;
  answeringMessageId: string | null;
  answerContent: string;
  onSetAnswerContent: ((content: string) => void) | null;
  editorAttachments: File[];
  isLoadingRetryAttachments: boolean;
  selectedCharacter: string | null;
  selectedModel: string | null;
  /** Send message for tool confirmations (null in read-only mode) */
  sendMessage: ((params: SendMessageParams) => void) | null;
  /** Credit deduction callback (null in read-only mode) */
  deductCredits: ((creditCost: number, feature: string) => void) | null;
}

export const LinearMessageView = React.memo(function LinearMessageView({
  messages,
  branchInfo,
  locale,
  logger,
  currentUserId,
  user,
  viewMode,
  collapseState,
  rootFolderId,
  subFolderId,
  onDeleteMessage,
  onRetryMessage,
  onSwitchBranch,
  onBranchMessage,
  onStartEdit,
  onStartRetry,
  onStartAnswer,
  answerAsAI,
  onCancelAction,
  editingMessageId,
  retryingMessageId,
  answeringMessageId,
  answerContent,
  onSetAnswerContent,
  editorAttachments,
  isLoadingRetryAttachments,
  selectedCharacter,
  selectedModel,
  sendMessage,
  deductCredits,
}: LinearMessageViewProps): JSX.Element {
  const { t } = simpleT(locale);

  // Group messages by sequence for proper display (memoized)
  const messageGroups = useMemo(
    () => groupMessagesBySequence(messages),
    [messages],
  );

  // Create a map of message IDs to their groups for quick lookup (memoized)
  const messageToGroupMap = useMemo(() => {
    const map = new Map<string, (typeof messageGroups)[0]>();
    for (const group of messageGroups) {
      map.set(group.primary.id, group);
      for (const continuation of group.continuations) {
        map.set(continuation.id, group);
      }
    }
    return map;
  }, [messageGroups]);

  // Check for root-level branches (multiple root messages)
  const rootBranches = branchInfo[BRANCH_INDEX_KEY];
  const hasRootBranches = rootBranches && rootBranches.siblings.length > 1;

  // Get user's timezone from browser (stable — timezone doesn't change during session)
  const timezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  return (
    <>
      {/* Show root-level branch navigator if there are multiple root messages */}
      {hasRootBranches && onSwitchBranch && (
        <Div className="md:flex md:justify-end">
          <Div className="mb-3 md:w-[75%]">
            <BranchNavigator
              currentBranchIndex={rootBranches.currentIndex}
              totalBranches={rootBranches.siblings.length}
              branches={rootBranches.siblings.map((sibling) => {
                const content = sibling.content ?? "";
                return {
                  id: sibling.id,
                  preview:
                    content.slice(0, 50) + (content.length > 50 ? "..." : ""),
                };
              })}
              onSwitchBranch={(index) =>
                onSwitchBranch(BRANCH_INDEX_KEY, index)
              }
              locale={locale}
            />
          </Div>
        </Div>
      )}

      {/* Show System Prompt in Debug Mode */}
      {viewMode === ViewMode.DEBUG && (
        <DebugSystemPrompt
          locale={locale}
          rootFolderId={rootFolderId}
          subFolderId={subFolderId}
          characterId={selectedCharacter}
          selectedModel={selectedModel ?? undefined}
          user={user}
          logger={logger}
        />
      )}

      {messages.map((message, index) => {
        const isEditing = editingMessageId === message.id;
        const isRetrying =
          retryingMessageId === message.id && !isLoadingRetryAttachments;
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
            {/* Show Message Metadata in Debug Mode */}
            {viewMode === ViewMode.DEBUG &&
              (message.role === ChatMessageRole.USER ||
                message.role === ChatMessageRole.ASSISTANT) && (
                <Div className={cn(chatAnimations.slideIn, "mb-2")}>
                  <Div
                    className={cn(
                      "rounded-lg px-3 py-2 text-xs font-mono",
                      "bg-blue-500/10 border border-blue-500/20",
                      "text-blue-300",
                      chatShadows.sm,
                    )}
                  >
                    {createMetadataSystemMessage(
                      message,
                      rootFolderId,
                      timezone,
                    )}
                  </Div>
                </Div>
              )}

            {/* In debug mode: trailing system message + context appear before edit/retry,
                because the AI receives history up to (not including) the edited message,
                then trailing, then context — matching the actual messages array order. */}
            {viewMode === ViewMode.DEBUG && (isEditing || isRetrying) && (
              <DebugTrailingContext
                locale={locale}
                rootFolderId={rootFolderId}
                subFolderId={subFolderId}
                characterId={selectedCharacter}
                selectedModel={selectedModel ?? undefined}
                user={user}
                logger={logger}
              />
            )}

            <ErrorBoundary locale={locale}>
              <Div className={cn(chatAnimations.slideIn, "group")}>
                {isEditing && onBranchMessage && onCancelAction ? (
                  <Div className="flex justify-end">
                    <MessageEditor
                      message={message}
                      onBranch={onBranchMessage}
                      onCancel={onCancelAction}
                      locale={locale}
                      logger={logger}
                      user={user}
                    />
                  </Div>
                ) : isRetrying && onCancelAction ? (
                  <Div className="flex justify-end">
                    <ModelCharacterSelectorModal
                      titleKey="app.chat.linearMessageView.retryModal.title"
                      descriptionKey="app.chat.linearMessageView.retryModal.description"
                      onConfirm={async (): Promise<void> => {
                        if (onRetryMessage) {
                          void onRetryMessage(
                            message.id,
                            editorAttachments.length > 0
                              ? editorAttachments
                              : undefined,
                          );
                        }
                        onCancelAction();
                      }}
                      onCancel={onCancelAction}
                      confirmLabelKey="app.chat.linearMessageView.retryModal.confirmLabel"
                      locale={locale}
                      logger={logger}
                      user={user}
                    />
                  </Div>
                ) : (
                  <>
                    {message.role === "user" && (
                      // First message: on md+ has left margin to align next to sticky logo (same line)
                      // Below md: no margin (logo is above on separate line)
                      <Div className={index === 0 ? "md:ml-18" : undefined}>
                        <UserMessageBubble
                          message={message}
                          locale={locale}
                          logger={logger}
                          onBranch={onStartEdit ?? undefined}
                          onRetry={
                            onStartRetry
                              ? async (msg): Promise<void> => {
                                  onStartRetry(msg.id);
                                }
                              : undefined
                          }
                          onDelete={onDeleteMessage ?? undefined}
                          showAuthor={rootFolderId === "public"}
                          rootFolderId={rootFolderId}
                          currentUserId={currentUserId ?? undefined}
                        />
                      </Div>
                    )}
                    {(message.role === "assistant" ||
                      message.role === "tool") &&
                      group && (
                        <GroupedAssistantMessage
                          group={group}
                          locale={locale}
                          onAnswerAsModel={onStartAnswer}
                          onDelete={onDeleteMessage}
                          showAuthor={true}
                          logger={logger}
                          readOnly={!onDeleteMessage}
                          collapseState={collapseState}
                          platformOverride={null}
                          rootFolderId={rootFolderId}
                          user={user}
                          sendMessage={sendMessage}
                          deductCredits={deductCredits}
                          className={index === 0 ? "md:mt-10" : undefined}
                        />
                      )}
                    {message.role === "error" && (
                      <ErrorMessageBubble message={message} />
                    )}
                    {/* Debug mode: Show system messages inline */}
                    {viewMode === ViewMode.DEBUG &&
                      message.role === ChatMessageRole.SYSTEM && (
                        <Div className="flex items-start gap-3">
                          <Div className="flex-1 max-w-full">
                            <Div className="mb-2">
                              <MessageAuthorInfo
                                authorName={t(
                                  "app.chat.debugView.systemMessage",
                                )}
                                authorId={null}
                                currentUserId={undefined}
                                isAI={true}
                                model={message.model}
                                timestamp={message.createdAt}
                                edited={false}
                                character={null}
                                locale={locale}
                                rootFolderId={rootFolderId}
                                compact
                              />
                            </Div>

                            <Div
                              className={cn(
                                chatProse.all,
                                "pl-2 py-2.5 sm:py-3",
                                "border border-blue-500/30 bg-blue-500/5 rounded-md",
                              )}
                            >
                              <Markdown content={message.content ?? ""} />
                            </Div>

                            <Div className="mt-1 text-xs text-muted-foreground pl-2">
                              {t("app.chat.debugView.systemMessageHint")}
                            </Div>
                          </Div>
                        </Div>
                      )}
                  </>
                )}
              </Div>
            </ErrorBoundary>

            {/* Show Answer-as-AI dialog below the message */}
            {isAnswering && onCancelAction && (
              <Div className="my-3">
                <ModelCharacterSelectorModal
                  titleKey="app.chat.linearMessageView.answerModal.title"
                  descriptionKey="app.chat.linearMessageView.answerModal.description"
                  showInput={true}
                  inputValue={answerContent}
                  onInputChange={onSetAnswerContent ?? undefined}
                  inputPlaceholderKey="app.chat.linearMessageView.answerModal.inputPlaceholder"
                  onConfirm={async (): Promise<void> => {
                    if (answerAsAI) {
                      await answerAsAI(message.id, answerContent, undefined);
                    }
                    onCancelAction();
                  }}
                  onCancel={onCancelAction}
                  confirmLabelKey="app.chat.linearMessageView.answerModal.confirmLabel"
                  locale={locale}
                  logger={logger}
                  user={user}
                />
              </Div>
            )}

            {/* Show branch navigator if this message has multiple children */}
            {hasBranches && nextMessage && onSwitchBranch && (
              <Div className="my-3">
                <BranchNavigator
                  currentBranchIndex={branches.currentIndex}
                  totalBranches={branches.siblings.length}
                  branches={branches.siblings.map((sibling) => {
                    const content = sibling.content ?? "";
                    return {
                      id: sibling.id,
                      preview:
                        content.slice(0, 50) +
                        (content.length > 50 ? "..." : ""),
                    };
                  })}
                  onSwitchBranch={(index) => onSwitchBranch(message.id, index)}
                  locale={locale}
                />
              </Div>
            )}
          </React.Fragment>
        );
      })}

      {/* Trailing system message + upcoming context — shown after all messages when not editing/retrying.
          When editing/retrying, it appears inline before the editor above. */}
      {viewMode === ViewMode.DEBUG &&
        !editingMessageId &&
        !retryingMessageId && (
          <DebugTrailingContext
            locale={locale}
            rootFolderId={rootFolderId}
            subFolderId={subFolderId}
            characterId={selectedCharacter}
            selectedModel={selectedModel ?? undefined}
            user={user}
            logger={logger}
          />
        )}
    </>
  );
});
