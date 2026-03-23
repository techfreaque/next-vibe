"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div, type DivMouseEvent } from "next-vibe-ui/ui/div";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Span, type SpanMouseEvent } from "next-vibe-ui/ui/span";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React, { memo, useCallback, useMemo } from "react";

import { Logo } from "@/app/[locale]/_components/logo";
import {
  extractReferences,
  format4chanTimestamp,
  getIdColor,
} from "@/app/[locale]/chat/lib/utils/formatting";
import { formatPostNumber } from "@/app/[locale]/chat/lib/utils/post-numbers";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import { getVoteStatus } from "@/app/api/[locale]/agent/chat/threads/[threadId]/messages/[messageId]/vote/utils";
import { getModelById } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useWidgetNavigation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { Icon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useSkill } from "../../../../../skills/[id]/hooks";
import { loadMessageAttachments } from "../../hooks/load-message-attachments";
import type { CollapseStateStore } from "../../hooks/use-collapse-state";
import { useMessageEditorStore } from "../../hooks/use-message-editor-store";
import { scopedTranslation } from "../../i18n";
import { MessageEditor } from "../message-editor";
import type { groupMessagesBySequence } from "../message-grouping";
import { ModelSkillSelectorModal } from "../model-skill-selector-modal";
import { ReplyInput } from "../reply-input";
import { ToolDisplay } from "../tool-display";
import { countPostsByUserId, countReplies, getDirectReplies } from "./helpers";

export interface FlatMessageProps {
  message: ChatMessage;
  index: number;
  postNum: string;
  messages: ChatMessage[];
  messageGroup?: ReturnType<typeof groupMessagesBySequence>[0];
  locale: CountryLanguage;
  logger: EndpointLogger;
  isTouch: boolean;
  hoveredRef: string | null;
  onSetHoveredRef: (
    ref: string | null,
    position: { x: number; y: number } | null,
  ) => void;
  onSetHoveredUserId: (
    userId: string | null,
    position: { x: number; y: number } | null,
  ) => void;
  onInsertQuote?: () => void;
  /** Collapse state management callbacks */
  collapseState?: CollapseStateStore;
  currentUserId?: string;
  user: JwtPayloadType;
  /** Message operations - passed from parent (no context dependency) */
  onBranchMessage?: (
    messageId: string,
    content: string,
    audioInput: { file: File } | undefined,
    attachments: File[] | undefined,
  ) => Promise<void>;
  onRetryMessage?: (
    messageId: string,
    attachments: File[] | undefined,
  ) => Promise<void>;
  onAnswerAsModel?: (
    messageId: string,
    content: string,
    attachments: File[] | undefined,
  ) => Promise<void>;
  onReplyMessage?: (
    parentMessageId: string,
    content: string,
    attachments: File[],
  ) => Promise<void>;
  onVoteMessage?: (messageId: string, vote: 1 | -1 | 0) => Promise<void>;
}

export const FlatMessage = memo(function FlatMessage({
  message,
  postNum,
  messages,
  messageGroup,
  locale,
  logger,
  index,
  isTouch,
  hoveredRef,
  onSetHoveredRef,
  onSetHoveredUserId,
  collapseState,
  currentUserId,
  user,
  onBranchMessage,
  onRetryMessage,
  onAnswerAsModel,
  onReplyMessage,
  onVoteMessage,
}: FlatMessageProps): JSX.Element {
  // Navigation state from Zustand store directly
  const rootFolderId = useChatNavigationStore((s) => s.currentRootFolderId);
  const { push: navigate } = useWidgetNavigation();
  const { t } = scopedTranslation.scopedT(locale);

  const handleDelete = (): void => {
    void (async (): Promise<void> => {
      const messageIdDefs =
        await import("@/app/api/[locale]/agent/chat/threads/[threadId]/messages/[messageId]/definition");
      navigate(messageIdDefs.default.DELETE, {
        urlPathParams: { threadId: message.threadId, messageId: message.id },
        data: rootFolderId ? { rootFolderId } : undefined,
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };
  // simpleT needed for format4chanTimestamp which uses global app.chat.flatView.timestamp.* keys
  const { t: tGlobal } = simpleT(locale);

  // Editor state from Zustand store (shared across all view modes)
  const editingMessageId = useMessageEditorStore((s) => s.editingMessageId);
  const retryingMessageId = useMessageEditorStore((s) => s.retryingMessageId);
  const answeringMessageId = useMessageEditorStore((s) => s.answeringMessageId);
  const replyingToMessageId = useMessageEditorStore(
    (s) => s.replyingToMessageId,
  );
  const answerContent = useMessageEditorStore((s) => s.answerContent);
  const editorAttachments = useMessageEditorStore((s) => s.editorAttachments);
  const isLoadingRetryAttachments = useMessageEditorStore(
    (s) => s.isLoadingRetryAttachments,
  );
  const startEdit = useMessageEditorStore((s) => s.startEdit);
  const startAnswer = useMessageEditorStore((s) => s.startAnswer);
  const startReply = useMessageEditorStore((s) => s.startReply);
  const cancelAction = useMessageEditorStore((s) => s.cancelAction);
  const setAnswerContent = useMessageEditorStore((s) => s.setAnswerContent);
  const setLoadingRetryAttachments = useMessageEditorStore(
    (s) => s.setLoadingRetryAttachments,
  );
  const setEditorAttachments = useMessageEditorStore(
    (s) => s.setEditorAttachments,
  );
  const setRetrying = useMessageEditorStore((s) => s.setRetrying);
  const clearAnswering = useMessageEditorStore((s) => s.clearAnswering);
  const clearReplying = useMessageEditorStore((s) => s.clearReplying);

  const startRetry = useCallback(
    async (msg: ChatMessage) => {
      cancelAction();
      setLoadingRetryAttachments(true);
      const attachments = await loadMessageAttachments(msg, logger);
      setEditorAttachments(attachments);
      setRetrying(msg.id);
    },
    [
      cancelAction,
      setLoadingRetryAttachments,
      setEditorAttachments,
      setRetrying,
      logger,
    ],
  );

  const handleBranchEdit = useCallback(
    async (
      messageId: string,
      content: string,
      onBranch?: (
        id: string,
        content: string,
        audioInput: { file: File } | undefined,
        attachments: File[] | undefined,
      ) => Promise<void>,
    ) => {
      if (!onBranch) {
        return;
      }
      try {
        await onBranch(
          messageId,
          content,
          undefined,
          editorAttachments.length > 0 ? editorAttachments : undefined,
        );
        // Editor closed via event-handlers.ts when USER MESSAGE_CREATED arrives
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        logger.error(
          "widget.messages.actions.handleBranchEdit.error",
          errorObj,
        );
      }
    },
    [logger, editorAttachments],
  );

  const handleConfirmRetry = useCallback(
    async (
      messageId: string,
      onRetry?: (id: string, attachments: File[] | undefined) => Promise<void>,
    ) => {
      if (!onRetry) {
        return;
      }
      try {
        await onRetry(
          messageId,
          editorAttachments.length > 0 ? editorAttachments : undefined,
        );
        // Editor closed via event-handlers.ts when USER MESSAGE_CREATED arrives
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        logger.error(
          "widget.messages.actions.handleConfirmRetry.error",
          errorObj,
        );
      }
    },
    [logger, editorAttachments],
  );

  const handleConfirmAnswer = useCallback(
    async (
      messageId: string,
      onAnswer?: (
        id: string,
        content: string,
        attachments: File[] | undefined,
      ) => Promise<void>,
    ) => {
      if (!onAnswer) {
        return;
      }
      try {
        await onAnswer(
          messageId,
          answerContent,
          editorAttachments.length > 0 ? editorAttachments : undefined,
        );
        clearAnswering();
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        logger.error(
          "widget.messages.actions.handleConfirmAnswer.error",
          errorObj,
        );
      }
    },
    [logger, answerContent, editorAttachments, clearAnswering],
  );

  const handleConfirmReply = useCallback(
    async (
      messageId: string,
      onReply:
        | ((
            parentMessageId: string,
            content: string,
            attachments: File[],
          ) => Promise<void>)
        | undefined,
      content: string,
      attachments: File[],
    ) => {
      if (!onReply) {
        return;
      }
      try {
        await onReply(messageId, content, attachments);
        clearReplying();
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        logger.error(
          "widget.messages.actions.handleConfirmReply.error",
          errorObj,
        );
      }
    },
    [logger, clearReplying],
  );

  const character = useSkill(message.skill || undefined, user, logger);

  // TTS support for assistant messages is handled by the message action buttons

  // Get all messages in the sequence (primary + continuations) - memoized
  const allMessagesInSequence = useMemo(
    () =>
      messageGroup
        ? [messageGroup.primary, ...messageGroup.continuations]
        : [message],
    [messageGroup, message],
  );

  // User ID logic
  const userId =
    message.role === "user"
      ? message.authorId || "local-user"
      : message.role === "assistant" && message.model
        ? message.model
        : "assistant";

  const idColor = getIdColor(userId);
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  // Get display names
  const modelData =
    message.role === "assistant" && message.model
      ? getModelById(message.model)
      : null;
  const modelDisplayName =
    modelData?.name || t("widget.flatView.assistantFallback");
  // Get character name from characters map
  const characterName = character.read?.data?.name;
  const characterDisplayName =
    (message.role === "user" || message.role === "assistant") &&
    message.skill &&
    characterName
      ? characterName
      : t("widget.flatView.anonymous");

  // Determine display name for user messages
  let displayName: string;
  if (isUser) {
    if (rootFolderId === "public" || rootFolderId === "shared") {
      // Public/shared: show stored authorName or Anonymous - ID badge shown separately
      displayName = message.authorName ?? t("widget.flatView.anonymous");
    } else {
      // Private/incognito/cron: always "You"
      displayName = t("widget.flatView.youLabel");
    }
  } else {
    // AI messages show model name
    displayName = modelDisplayName;
  }

  const references = extractReferences(message.content);
  const replyCount = countReplies(messages, message.id);
  const isHighlighted = hoveredRef === postNum.toString();
  const directReplies = getDirectReplies(messages, message.id);

  // Vote state - only for non-incognito, signed-in users
  const canVote =
    onVoteMessage && currentUserId && rootFolderId !== "incognito";
  const { userVote, voteScore } = getVoteStatus(message, currentUserId);

  return (
    <Div
      key={message.id}
      id={`${postNum}`}
      className={cn(
        "group/post relative",
        "p-3 mb-2 rounded",
        "transition-colors duration-150",
        isHighlighted && "bg-blue-500/5",
      )}
    >
      {/* Logo watermark for first message */}
      {index === 0 && (
        <Div className="absolute top-3 right-3 pointer-events-none bg-card backdrop-blur-xl rounded-md p-1.5 shadow-sm border border-border/10 opacity-70">
          <Logo locale={locale} pathName="/" size="h-6" />
        </Div>
      )}

      {/* Post Header */}
      <Div className="flex items-center gap-2.5 mb-3 flex-wrap">
        {/* Author Name with Model Icon */}
        <Span
          className={cn(
            "font-bold text-sm flex items-center gap-1.5",
            isUser ? "text-foreground" : "text-primary",
          )}
        >
          {/* Show model icon for AI messages */}
          {!isUser && modelData && (
            <Icon icon={modelData.icon} className="h-3.5 w-3.5" />
          )}
          {displayName}
        </Span>

        {/* ID Badge - Hoverable */}
        <Div
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect!();
            onSetHoveredUserId(userId, {
              x: rect.left + rect.width / 2,
              y: rect.bottom,
            });
          }}
          onMouseLeave={() => {
            onSetHoveredUserId(null, null);
          }}
          style={{
            backgroundColor: `${idColor}15`,
            color: idColor,
            borderColor: `${idColor}40`,
            borderWidth: "1px",
          }}
        >
          <Button
            variant="ghost"
            size="unset"
            className="px-2 py-0.5 rounded text-xs font-mono font-semibold shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
            title={t("widget.flatView.postsById", {
              count: countPostsByUserId(messages, userId),
            })}
            suppressHydrationWarning
          >
            {isUser
              ? t("widget.flatView.idLabel", { id: userId.slice(0, 8) })
              : characterDisplayName}
          </Button>
        </Div>

        {/* Timestamp */}
        <Span
          className="text-muted-foreground/80 text-xs font-medium"
          suppressHydrationWarning
        >
          {format4chanTimestamp(message.createdAt.getTime(), tGlobal)}
        </Span>

        {/* Post Number */}
        <Button
          variant="ghost"
          size="unset"
          className="text-primary hover:text-primary/80 text-xs font-semibold cursor-pointer hover:underline"
          onClick={(): void => {
            void navigator.clipboard.writeText(`>>${postNum}`);
          }}
          title={t("widget.flatView.clickToCopyRef")}
        >
          {formatPostNumber(postNum, locale)}
        </Button>

        {/* Reply count badge */}
        {replyCount > 0 && (
          <Span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-bold border border-primary/30">
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </Span>
        )}

        {/* Vote score badge - always show if non-zero */}
        {(voteScore !== 0 || canVote) && (
          <Div className="flex items-center gap-0.5">
            {canVote && (
              <Button
                variant="ghost"
                size="unset"
                onClick={() =>
                  onVoteMessage(message.id, userVote === "up" ? 0 : 1)
                }
                className={cn(
                  "px-1 py-0.5 rounded text-xs transition-colors",
                  userVote === "up"
                    ? "text-blue-400"
                    : "text-muted-foreground/60 hover:text-blue-400",
                )}
                title={t("widget.flatView.actions.upvote")}
              >
                ▲
              </Button>
            )}
            {voteScore !== 0 && (
              <Span
                className={cn(
                  "text-xs font-bold",
                  voteScore > 0 && "text-blue-400",
                  voteScore < 0 && "text-red-400",
                )}
              >
                {voteScore > 0 ? `+${voteScore}` : voteScore}
              </Span>
            )}
            {canVote && (
              <Button
                variant="ghost"
                size="unset"
                onClick={() =>
                  onVoteMessage(message.id, userVote === "down" ? 0 : -1)
                }
                className={cn(
                  "px-1 py-0.5 rounded text-xs transition-colors",
                  userVote === "down"
                    ? "text-red-400"
                    : "text-muted-foreground/60 hover:text-red-400",
                )}
                title={t("widget.flatView.actions.downvote")}
              >
                ▼
              </Button>
            )}
          </Div>
        )}

        {/* Reply indicator - Arrow symbol is technical, not user-facing text */}

        {references.length > 0 && (
          // eslint-disable-next-line i18next/no-literal-string -- Technical arrow symbol for reply indicator
          <Span className="text-primary/60 text-xs">▶</Span>
        )}
      </Div>

      {/* Replying To */}
      {message.parentId &&
        ((): JSX.Element | null => {
          const parentMsg = messages.find((m) => m.id === message.parentId);
          if (!parentMsg) {
            return null;
          }
          const parentPostNum = parentMsg.id.split("-")[0];
          return (
            <Div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Span>{t("widget.flatView.replyingTo")}</Span>
              <Div
                onMouseEnter={(e: DivMouseEvent) => {
                  const rect = e.currentTarget.getBoundingClientRect!();
                  onSetHoveredRef(parentPostNum.toString(), {
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  });
                }}
                onMouseLeave={() => {
                  onSetHoveredRef(null, null);
                }}
              >
                <Button
                  variant="ghost"
                  size="unset"
                  onClick={() => {
                    const element = document.getElementById(`${parentPostNum}`);
                    element?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  className="text-primary hover:text-primary/80 underline decoration-transparent hover:decoration-current font-semibold"
                >
                  {/* eslint-disable-next-line i18next/no-literal-string -- Technical 4chan-style reference syntax */}
                  {`>>${parentPostNum}`}
                </Button>
              </Div>
            </Div>
          );
        })()}

      {/* Message Content */}
      {editingMessageId === message.id ? (
        <Div className="my-2">
          <MessageEditor
            message={message}
            onBranch={
              onBranchMessage
                ? (id, content): Promise<void> =>
                    handleBranchEdit(id, content, onBranchMessage)
                : (): Promise<void> => {
                    logger.warn(
                      "FlatMessageView",
                      "Branch operation not available - onBranchMessage handler not provided",
                    );
                    return Promise.resolve();
                  }
            }
            onCancel={cancelAction}
            locale={locale}
            logger={logger}
            user={user}
          />
        </Div>
      ) : retryingMessageId === message.id && !isLoadingRetryAttachments ? (
        <Div className="my-2">
          <ModelSkillSelectorModal
            titleKey="widget.flatView.retryModal.title"
            descriptionKey="widget.flatView.retryModal.description"
            onConfirm={(): Promise<void> =>
              handleConfirmRetry(message.id, onRetryMessage)
            }
            onCancel={cancelAction}
            confirmLabelKey="widget.flatView.retryModal.confirmLabel"
            locale={locale}
            logger={logger}
            user={user}
          />
        </Div>
      ) : message.role === "error" ? (
        <Div
          className={cn(
            "text-sm leading-relaxed",
            "p-3",
            "rounded border transition-colors duration-150",
            "border-destructive/60 bg-destructive/10",
          )}
        >
          <Div className="whitespace-pre-wrap wrap-break-word text-destructive font-medium">
            {message.content}
          </Div>
        </Div>
      ) : message.role === "tool" ? (
        <Div
          className={cn(
            "text-sm leading-relaxed",
            "p-3",
            "rounded border transition-colors duration-150",
            isHighlighted
              ? "border-blue-500/60 bg-blue-500/5"
              : "border-border/30 hover:border-border/50",
          )}
        >
          {/* TOOL messages have toolCall in metadata (singular) */}
          {message.metadata?.toolCall && (
            <ToolDisplay
              toolCall={message.metadata.toolCall}
              locale={locale}
              user={user}
              threadId={message.threadId}
              messageId={message.id}
              collapseState={collapseState}
              logger={logger}
            />
          )}
        </Div>
      ) : (
        <Div
          className={cn(
            "text-sm leading-relaxed",
            "p-3",
            "rounded border transition-colors duration-150",
            isHighlighted
              ? "border-blue-500/60 bg-blue-500/5"
              : "border-border/30 hover:border-border/50",
          )}
        >
          {/* Render all messages in sequence */}
          {allMessagesInSequence.map((msg, msgIndex) => {
            const hasContentAfter = allMessagesInSequence
              .slice(msgIndex + 1)
              .some((m) => (m.content ?? "").trim().length > 0);

            if (msg.role === "tool" && msg.metadata?.toolCall) {
              return (
                <ToolDisplay
                  key={msg.id}
                  toolCall={msg.metadata.toolCall}
                  locale={locale}
                  user={user}
                  threadId={msg.threadId}
                  messageId={msg.id}
                  collapseState={collapseState}
                  logger={logger}
                />
              );
            }

            if (!(msg.content ?? "").trim()) {
              return null;
            }

            return (
              <React.Fragment key={msg.id}>
                {isAssistant ? (
                  <Div
                    className={cn(
                      "prose prose-sm dark:prose-invert max-w-none",
                      "prose-p:my-2 prose-p:leading-relaxed",
                      "prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded",
                      "prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-md",
                      "prose-headings:text-foreground prose-headings:font-bold",
                      "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
                      msgIndex > 0 && "mt-3",
                    )}
                  >
                    <Markdown
                      content={msg.content ?? ""}
                      messageId={msg.id}
                      hasContentAfter={hasContentAfter}
                      collapseState={collapseState}
                    />
                  </Div>
                ) : (
                  <Div
                    className={cn(
                      "whitespace-pre-wrap wrap-break-word text-foreground/95",
                      msgIndex > 0 && "mt-3",
                    )}
                  >
                    <Markdown content={msg.content ?? ""} messageId={msg.id} />
                  </Div>
                )}
              </React.Fragment>
            );
          })}
        </Div>
      )}

      {/* Show Reply input below the message */}
      {replyingToMessageId === message.id && (
        <Div className="my-3">
          <ReplyInput
            parentMessageId={message.id}
            onReply={async (parentId, content, attachments) => {
              await handleConfirmReply(
                parentId,
                onReplyMessage,
                content,
                attachments,
              );
            }}
            onCancel={cancelAction}
            locale={locale}
            logger={logger}
            user={user}
          />
        </Div>
      )}

      {/* Show Answer-as-AI dialog below the message */}
      {answeringMessageId === message.id && (
        <Div className="my-3">
          <ModelSkillSelectorModal
            titleKey="widget.flatView.answerModal.title"
            descriptionKey="widget.flatView.answerModal.description"
            showInput={true}
            inputValue={answerContent}
            onInputChange={setAnswerContent}
            inputPlaceholderKey="widget.flatView.answerModal.inputPlaceholder"
            onConfirm={(): Promise<void> =>
              handleConfirmAnswer(message.id, onAnswerAsModel)
            }
            onCancel={cancelAction}
            confirmLabelKey="widget.flatView.answerModal.confirmLabel"
            locale={locale}
            logger={logger}
            user={user}
          />
        </Div>
      )}

      {/* Replies */}
      {directReplies.length > 0 && (
        <Div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Span>{t("widget.flatView.replies")}</Span>
          {directReplies.map((reply) => {
            const replyPostNum = reply.id.split("-")[0];
            return (
              <Span
                key={reply.id}
                onMouseEnter={(e: SpanMouseEvent) => {
                  const rect = e.currentTarget.getBoundingClientRect!();
                  onSetHoveredRef(replyPostNum.toString(), {
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  });
                }}
                onMouseLeave={() => {
                  onSetHoveredRef(null, null);
                }}
              >
                <Button
                  variant="ghost"
                  size="unset"
                  onClick={() => {
                    const element = document.getElementById(`${replyPostNum}`);
                    element?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  className="text-primary hover:text-primary/80 underline decoration-transparent hover:decoration-current font-semibold"
                >
                  {/* eslint-disable-next-line i18next/no-literal-string -- Technical 4chan-style reference syntax */}
                  {`>>${replyPostNum}`}
                </Button>
              </Span>
            );
          })}
        </Div>
      )}

      {/* Post Actions - 4chan-style text links */}
      {!editingMessageId &&
        !retryingMessageId &&
        !answeringMessageId &&
        !replyingToMessageId && (
          <Div
            className={cn(
              "mt-3 flex items-center gap-3 text-xs flex-wrap",
              "transition-opacity duration-200",
              isTouch
                ? "opacity-70 active:opacity-100"
                : "opacity-0 group-hover/post:opacity-100 focus-within:opacity-100",
            )}
          >
            {/* Reply - sends a user message as child, then AI responds */}
            <Button
              variant="ghost"
              size="unset"
              onClick={(): void => startReply(message.id)}
              className="text-primary hover:text-primary/80 hover:underline transition-colors"
              title={t("widget.flatView.actions.replyToMessage")}
            >
              [{t("widget.flatView.actions.reply")}]
            </Button>

            {/* Branch - user messages only: creates sibling with edited content */}
            {isUser && (
              <Button
                variant="ghost"
                size="unset"
                onClick={(): void => {
                  startEdit(message.id);
                }}
                className="text-foreground hover:text-foreground/80 hover:underline transition-colors"
                title={t("widget.flatView.actions.branchMessage")}
              >
                [{t("widget.flatView.actions.branch")}]
              </Button>
            )}

            {/* Retry - user messages only: creates sibling with same content, different model */}
            {isUser && (
              <Button
                variant="ghost"
                size="unset"
                onClick={(): void => {
                  void startRetry(message);
                }}
                className="text-foreground hover:text-foreground/80 hover:underline transition-colors"
                title={t("widget.flatView.actions.retryWithDifferent")}
              >
                [{t("widget.flatView.actions.retry")}]
              </Button>
            )}

            {/* Answer as AI */}
            <Button
              variant="ghost"
              size="unset"
              onClick={(): void => {
                startAnswer(message.id);
              }}
              className="text-primary hover:text-primary/80 hover:underline transition-colors"
              title={t("widget.flatView.actions.generateAIResponse")}
            >
              [{t("widget.flatView.actions.answerAsAI")}]
            </Button>

            {/* Copy Link */}
            <Button
              variant="ghost"
              size="unset"
              onClick={(): void => {
                void navigator.clipboard.writeText(`>>${postNum}`);
              }}
              className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
              title={t("widget.flatView.actions.copyReference")}
            >
              [{t("widget.flatView.actions.copyReference")}]
            </Button>

            {/* Delete */}
            <Button
              variant="ghost"
              size="unset"
              onClick={handleDelete}
              className="px-2 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive/80 transition-all"
              title={t("widget.flatView.actions.deleteMessage")}
            >
              [{t("widget.flatView.actions.delete")}]
            </Button>
          </Div>
        )}
    </Div>
  );
});
