/**
 * Linear Message View Component
 * Renders messages in a linear ChatGPT-style view with branch navigation
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React, { useMemo } from "react";

import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";
import { chatAnimations } from "@/app/[locale]/chat/lib/design-tokens";
import type { SendMessageParams } from "@/app/api/[locale]/agent/ai-stream/stream/hooks/send-message";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { getVoteStatus } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/[messageId]/vote/utils";
import type { TtsModelId } from "@/app/api/[locale]/agent/text-to-speech/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { BRANCH_INDEX_KEY } from "../../hooks/use-branch-management";
import type { CollapseStateStore } from "../../hooks/use-collapse-state";
import { scopedTranslation } from "../../i18n";
import { BranchNavigator } from "../branch-navigator";
import { ErrorMessageBubble } from "../error-message-bubble";
import { GroupedAssistantMessage } from "../grouped-assistant-message";
import { MessageEditor } from "../message-editor";
import { groupMessagesBySequence } from "../message-grouping";
import { ModelSkillSelectorModal } from "../model-skill-selector-modal";
import { UserMessageBubble } from "../user-message-bubble";

export interface LinearMessageViewProps {
  messages: ChatMessage[];
  branchInfo: Record<string, { siblings: ChatMessage[]; currentIndex: number }>;
  locale: CountryLanguage;
  logger: EndpointLogger;
  currentUserId: string | null;
  user: JwtPayloadType;
  collapseState: CollapseStateStore | null;
  rootFolderId: DefaultFolderId;
  subFolderId: string | null;
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
  selectedSkill: string | null;
  selectedModel: string | null;
  /** Send message for tool confirmations (null in read-only mode) */
  sendMessage: ((params: SendMessageParams) => void) | null;
  /** Credit deduction callback (null in read-only mode) */
  deductCredits: ((creditCost: number, feature: string) => void) | null;
  /** Load newer history chunk (called when BOUNDARY_NEWER sentinel is clicked) */
  onLoadNewerHistory: ((anchorId: string) => void) | null;
  /** Whether newer history is currently loading */
  isLoadingNewerHistory: boolean;
  /** Vote callback - null when voting is not available */
  onVoteMessage:
    | ((messageId: string, vote: 1 | -1 | 0) => Promise<void>)
    | null;
  ttsAutoplay: boolean;
  voiceId: TtsModelId | undefined;
  /** Optional debug slots - only provided by DebugLinearMessageView */
  debugLeading?: JSX.Element;
  renderDebugBeforeMessage?: (
    message: ChatMessage,
    isEditing: boolean,
    isRetrying: boolean,
  ) => JSX.Element | null;
  debugTrailing?: JSX.Element;
}

export const LinearMessageView = React.memo(function LinearMessageView({
  messages,
  branchInfo,
  locale,
  logger,
  currentUserId,
  user,
  collapseState,
  rootFolderId,
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
  sendMessage,
  deductCredits,
  onLoadNewerHistory,
  isLoadingNewerHistory,
  onVoteMessage,
  ttsAutoplay,
  voiceId,
  debugLeading,
  renderDebugBeforeMessage,
  debugTrailing,
}: LinearMessageViewProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);

  const messageGroups = useMemo(
    () => groupMessagesBySequence(messages),
    [messages],
  );

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

  const rootBranches = branchInfo[BRANCH_INDEX_KEY];
  const hasRootBranches = rootBranches && rootBranches.siblings.length > 1;

  return (
    <>
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

      {debugLeading}

      {messages.map((message, index) => {
        const isEditing = editingMessageId === message.id;
        const isRetrying =
          retryingMessageId === message.id && !isLoadingRetryAttachments;
        const isAnswering = answeringMessageId === message.id;

        const nextMessage =
          index < messages.length - 1 ? messages[index + 1] : null;

        const group = messageToGroupMap.get(message.id);
        const isContinuation = group && group.primary.id !== message.id;

        if (isContinuation) {
          return null;
        }

        const allGroupMessages = group
          ? [group.primary, ...group.continuations]
          : [message];

        // Find branch info for this message or any of its group continuations.
        // When the branch point is a tool message (continuation), it is skipped
        // by the isContinuation guard above - so we scan the full group here.
        let branches = branchInfo[message.id];
        let branchPointId = message.id;
        if (!branches) {
          for (const gm of allGroupMessages) {
            const b = branchInfo[gm.id];
            if (b) {
              branches = b;
              branchPointId = gm.id;
            }
          }
        }
        const hasBranches = branches && branches.siblings.length > 1;
        const newerMsg = allGroupMessages.find(
          (m) =>
            m.metadata?.hasNewerHistory === true && m.metadata?.newerAnchorId,
        );
        const hasNewerHistory = newerMsg !== undefined;
        const newerAnchorId = newerMsg
          ? newerMsg.metadata?.newerAnchorId
          : null;

        return (
          <React.Fragment key={message.id}>
            {renderDebugBeforeMessage?.(message, isEditing, isRetrying)}

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
                    <ModelSkillSelectorModal
                      titleKey="widget.linearView.retryModal.title"
                      descriptionKey="widget.linearView.retryModal.description"
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
                      confirmLabelKey="widget.linearView.retryModal.confirmLabel"
                      locale={locale}
                      logger={logger}
                      user={user}
                    />
                  </Div>
                ) : (
                  <>
                    {message.role === "user" && (
                      <Div className={index === 0 ? "md:ml-18" : undefined}>
                        <UserMessageBubble
                          message={message}
                          locale={locale}
                          logger={logger}
                          user={user}
                          deductCredits={deductCredits}
                          onBranch={onStartEdit ?? undefined}
                          onRetry={
                            onStartRetry
                              ? async (msg): Promise<void> => {
                                  onStartRetry(msg.id);
                                }
                              : undefined
                          }
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
                          showAuthor={true}
                          logger={logger}
                          readOnly={false}
                          collapseState={collapseState}
                          platformOverride={null}
                          rootFolderId={rootFolderId}
                          user={user}
                          sendMessage={sendMessage}
                          deductCredits={deductCredits}
                          ttsAutoplay={ttsAutoplay}
                          voiceId={voiceId}
                          className={index === 0 ? "md:mt-10" : undefined}
                          onVote={onVoteMessage}
                          userVote={
                            getVoteStatus(
                              group.primary,
                              currentUserId ?? undefined,
                            ).userVote
                          }
                          voteScore={
                            getVoteStatus(
                              group.primary,
                              currentUserId ?? undefined,
                            ).voteScore
                          }
                        />
                      )}
                    {message.role === "error" && (
                      <ErrorMessageBubble
                        message={message}
                        rootFolderId={rootFolderId}
                      />
                    )}
                  </>
                )}
              </Div>
            </ErrorBoundary>

            {isAnswering && onCancelAction && (
              <Div className="my-3">
                <ModelSkillSelectorModal
                  titleKey="widget.linearView.answerModal.title"
                  descriptionKey="widget.linearView.answerModal.description"
                  showInput={true}
                  inputValue={answerContent}
                  onInputChange={onSetAnswerContent ?? undefined}
                  inputPlaceholderKey="widget.linearView.answerModal.inputPlaceholder"
                  onConfirm={async (): Promise<void> => {
                    if (answerAsAI) {
                      await answerAsAI(message.id, answerContent, undefined);
                    }
                    onCancelAction();
                  }}
                  onCancel={onCancelAction}
                  confirmLabelKey="widget.linearView.answerModal.confirmLabel"
                  locale={locale}
                  logger={logger}
                  user={user}
                />
              </Div>
            )}

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
                  onSwitchBranch={(branchIndex) =>
                    onSwitchBranch(branchPointId, branchIndex)
                  }
                  locale={locale}
                />
              </Div>
            )}

            {hasNewerHistory &&
              newerAnchorId &&
              onLoadNewerHistory &&
              !isLoadingNewerHistory && (
                <Div className="flex justify-center py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    onClick={(): void => {
                      onLoadNewerHistory(newerAnchorId);
                    }}
                  >
                    {t("showNewerMessages")}
                  </Button>
                </Div>
              )}
          </React.Fragment>
        );
      })}

      {debugTrailing}
    </>
  );
});
