import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div, type DivMouseEvent } from "next-vibe-ui/ui/div";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Span, type SpanMouseEvent } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import React from "react";

import { Logo } from "@/app/[locale]/_components/logo";
import {
  extractReferences,
  format4chanTimestamp,
  getIdColor,
} from "@/app/[locale]/chat/lib/utils/formatting";
import { formatPostNumber } from "@/app/[locale]/chat/lib/utils/post-numbers";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import { getIconComponent } from "@/app/api/[locale]/agent/chat/model-access/icons";
import type { ModelId } from "@/app/api/[locale]/agent/chat/model-access/models";
import { getModelById } from "@/app/api/[locale]/agent/chat/model-access/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { useCollapseState } from "../hooks/use-collapse-state";
import type { useMessageActions } from "../hooks/use-message-actions";
import { MessageEditor } from "../message-editor";
import type { groupMessagesBySequence } from "../message-grouping";
import { ModelPersonaSelectorModal } from "../model-character-selector-modal";
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
  messageActions: ReturnType<typeof useMessageActions>;
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
  collapseState?: ReturnType<typeof useCollapseState>;
  currentUserId?: string;
}

export function FlatMessage({
  message,
  postNum,
  messages,
  messageGroup,
  locale,
  logger,
  index,
  messageActions,
  isTouch,
  hoveredRef,
  onSetHoveredRef,
  onSetHoveredUserId,
  collapseState,
  currentUserId,
}: FlatMessageProps): JSX.Element {
  // Get callbacks and state from context
  const {
    characters,
    branchMessage: onBranchMessage,
    retryMessage: onRetryMessage,
    answerAsAI: onAnswerAsModel,
    handleDeleteMessage: onDeleteMessage,
    handleModelChange: onModelChange,
    setSelectedCharacter: onCharacterChange,
  } = useChatContext();
  const { t } = simpleT(locale);

  // TTS support for assistant messages is handled by the message action buttons

  // Get all messages in the sequence (primary + continuations)
  const allMessagesInSequence = messageGroup
    ? [messageGroup.primary, ...messageGroup.continuations]
    : [message];

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
    modelData?.name || t("app.chat.flatView.assistantFallback");
  // Get character name from characters map (fetched from server)
  const characterDisplayName =
    (message.role === "user" || message.role === "assistant") &&
    message.character
      ? characters[message.character]?.name || message.character
      : t("app.chat.flatView.anonymous");

  // Determine display name for user messages
  let displayName: string;
  if (isUser) {
    if (currentUserId && message.authorId === currentUserId) {
      // Current user's messages show "You"
      displayName = t("app.chat.flatView.youLabel");
    } else if (message.authorName) {
      // Other users show their name
      displayName = message.authorName;
    } else {
      // No author info - show "Anonymous"
      displayName = t("app.chat.flatView.anonymous");
    }
  } else {
    // AI messages show model name
    displayName = modelDisplayName;
  }

  const references = extractReferences(message.content);
  const replyCount = countReplies(messages, message.id);
  const isHighlighted = hoveredRef === postNum.toString();
  const directReplies = getDirectReplies(messages, message.id);

  return (
    <Div
      key={message.id}
      id={`${postNum}`}
      className={cn(
        "group/post relative",
        "p-3 mb-2 rounded",
        "transition-all duration-150",
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
          {!isUser &&
            modelData &&
            ((): JSX.Element | null => {
              const ModelIcon = getIconComponent(modelData.icon);
              return <ModelIcon className="h-3.5 w-3.5" />;
            })()}
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
            title={t("app.chat.flatView.postsById", {
              count: countPostsByUserId(messages, userId),
            })}
          >
            {isUser
              ? t("app.chat.flatView.idLabel", { id: userId.slice(0, 8) })
              : characterDisplayName}
          </Button>
        </Div>

        {/* Timestamp */}
        <Span className="text-muted-foreground/80 text-xs font-medium">
          {format4chanTimestamp(message.createdAt.getTime(), t)}
        </Span>

        {/* Post Number */}
        <Button
          variant="ghost"
          size="unset"
          className="text-primary hover:text-primary/80 text-xs font-semibold cursor-pointer hover:underline"
          onClick={(): void => {
            void navigator.clipboard.writeText(`>>${postNum}`);
          }}
          title={t("app.chat.flatView.clickToCopyRef")}
        >
          {formatPostNumber(postNum, locale)}
        </Button>

        {/* Reply count badge */}
        {replyCount > 0 && (
          <Span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-bold border border-primary/30">
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </Span>
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
              <Span>{t("app.chat.flatView.replyingTo")}</Span>
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
                  className="text-primary hover:text-primary/80 hover:underline font-semibold"
                >
                  {/* eslint-disable-next-line i18next/no-literal-string -- Technical 4chan-style reference syntax */}
                  {`>>${parentPostNum}`}
                </Button>
              </Div>
            </Div>
          );
        })()}

      {/* Message Content */}
      {messageActions.editingMessageId === message.id ? (
        <Div className="my-2">
          <MessageEditor
            message={message}
            onBranch={
              onBranchMessage
                ? (id, content): Promise<void> =>
                    messageActions.handleBranchEdit(
                      id,
                      content,
                      onBranchMessage,
                    )
                : (): Promise<void> => {
                    logger.warn(
                      "FlatMessageView",
                      "Branch operation not available - onBranchMessage handler not provided",
                    );
                    return Promise.resolve();
                  }
            }
            onCancel={messageActions.cancelAction}
            onModelChange={onModelChange}
            onCharacterChange={onCharacterChange}
            locale={locale}
            logger={logger}
          />
        </Div>
      ) : messageActions.retryingMessageId === message.id ? (
        <Div className="my-2">
          <ModelPersonaSelectorModal
            titleKey="app.chat.flatView.retryModal.title"
            descriptionKey="app.chat.flatView.retryModal.description"
            onModelChange={
              onModelChange ||
              ((model: ModelId): void => {
                logger.debug(
                  "FlatMessageView",
                  "Model selection changed (no handler)",
                  { model },
                );
              })
            }
            onCharacterChange={
              onCharacterChange ||
              ((character: string): void => {
                logger.debug(
                  "FlatMessageView",
                  "Character selection changed (no handler)",
                  { character },
                );
              })
            }
            onConfirm={(): Promise<void> =>
              messageActions.handleConfirmRetry(message.id, onRetryMessage)
            }
            onCancel={messageActions.cancelAction}
            confirmLabelKey="app.chat.flatView.retryModal.confirmLabel"
            locale={locale}
            logger={logger}
          />
        </Div>
      ) : message.role === "error" ? (
        <Div
          className={cn(
            "text-sm leading-relaxed",
            "p-3",
            "rounded border transition-all duration-150",
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
            "rounded border transition-all duration-150",
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
              threadId={message.threadId}
              messageId={message.id}
              collapseState={collapseState}
            />
          )}
        </Div>
      ) : (
        <Div
          className={cn(
            "text-sm leading-relaxed",
            "p-3",
            "rounded border transition-all duration-150",
            isHighlighted
              ? "border-blue-500/60 bg-blue-500/5"
              : "border-border/30 hover:border-border/50",
          )}
        >
          {/* Render all messages in sequence */}
          {allMessagesInSequence.map((msg, msgIndex) => {
            // Check if there's content after this message
            const hasContentAfter = allMessagesInSequence
              .slice(msgIndex + 1)
              .some((m) => m.content.trim().length > 0);

            // TOOL message
            if (msg.role === "tool" && msg.metadata?.toolCall) {
              return (
                <ToolDisplay
                  key={msg.id}
                  toolCall={msg.metadata.toolCall}
                  locale={locale}
                  threadId={msg.threadId}
                  messageId={msg.id}
                  collapseState={collapseState}
                />
              );
            }

            // Skip empty messages
            if (!msg.content.trim()) {
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
                      content={msg.content}
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
                    <Markdown content={msg.content} messageId={msg.id} />
                  </Div>
                )}
              </React.Fragment>
            );
          })}
        </Div>
      )}

      {/* Show Answer-as-AI dialog below the message */}
      {messageActions.answeringMessageId === message.id && (
        <Div className="my-3">
          <ModelPersonaSelectorModal
            titleKey="app.chat.flatView.answerModal.title"
            descriptionKey="app.chat.flatView.answerModal.description"
            onModelChange={
              onModelChange ||
              ((model: ModelId): void => {
                logger.debug(
                  "FlatMessageView",
                  "Model selection changed (no handler)",
                  { model },
                );
              })
            }
            onCharacterChange={
              onCharacterChange ||
              ((character: string): void => {
                logger.debug(
                  "FlatMessageView",
                  "Character selection changed (no handler)",
                  { character },
                );
              })
            }
            showInput={true}
            inputValue={messageActions.answerContent}
            onInputChange={messageActions.setAnswerContent}
            inputPlaceholderKey="app.chat.flatView.answerModal.inputPlaceholder"
            onConfirm={(): Promise<void> =>
              messageActions.handleConfirmAnswer(message.id, onAnswerAsModel)
            }
            onCancel={messageActions.cancelAction}
            confirmLabelKey="app.chat.flatView.answerModal.confirmLabel"
            locale={locale}
            logger={logger}
          />
        </Div>
      )}

      {/* Replies */}
      {directReplies.length > 0 && (
        <Div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Span>{t("app.chat.flatView.replies")}</Span>
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
                  className="text-primary hover:text-primary/80 hover:underline font-semibold"
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
      {!messageActions.editingMessageId &&
        !messageActions.retryingMessageId &&
        !messageActions.answeringMessageId && (
          <Div
            className={cn(
              "mt-3 flex items-center gap-3 text-xs flex-wrap",
              "transition-opacity duration-200",
              isTouch
                ? "opacity-70 active:opacity-100"
                : "opacity-0 group-hover/post:opacity-100 focus-within:opacity-100",
            )}
          >
            {/* Reply */}
            <Button
              variant="ghost"
              size="unset"
              onClick={(): void => messageActions.startEdit(message.id)}
              className="text-primary hover:text-primary/80 hover:underline transition-colors"
              title={t("app.chat.flatView.actions.replyToMessage")}
            >
              [{t("app.chat.flatView.actions.reply")}]
            </Button>

            {/* Edit/Branch */}
            {isUser && (
              <Button
                variant="ghost"
                size="unset"
                onClick={(): void => {
                  messageActions.startEdit(message.id);
                }}
                className="text-foreground hover:text-foreground/80 hover:underline transition-colors"
                title={t("app.chat.flatView.actions.editMessage")}
              >
                [{t("app.chat.flatView.actions.edit")}]
              </Button>
            )}

            {/* Retry */}
            {isUser && (
              <Button
                variant="ghost"
                size="unset"
                onClick={(): void => {
                  messageActions.startRetry(message.id);
                }}
                className="text-foreground hover:text-foreground/80 hover:underline transition-colors"
                title={t("app.chat.flatView.actions.retryWithDifferent")}
              >
                [{t("app.chat.flatView.actions.retry")}]
              </Button>
            )}

            {/* Answer as AI - For both user and assistant messages */}

            <Button
              variant="ghost"
              size="unset"
              onClick={(): void => {
                messageActions.startAnswer(message.id);
              }}
              className="text-primary hover:text-primary/80 hover:underline transition-colors"
              title={
                isAssistant
                  ? t("app.chat.threadedView.actions.respondToAI")
                  : t("app.chat.flatView.actions.generateAIResponse")
              }
            >
              [{t("app.chat.flatView.actions.answerAsAI")}]
            </Button>

            {/* Copy Link */}
            <Button
              variant="ghost"
              size="unset"
              onClick={(): void => {
                void navigator.clipboard.writeText(`>>${postNum}`);
              }}
              className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
              title={t("app.chat.flatView.actions.copyReference")}
            >
              [{t("app.chat.flatView.actions.copyReference")}]
            </Button>

            {/* Delete */}
            <Button
              variant="ghost"
              size="unset"
              onClick={(): void => {
                onDeleteMessage(message.id);
              }}
              className="px-2 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive/80 transition-all"
              title={t("app.chat.flatView.actions.deleteMessage")}
            >
              [{t("app.chat.flatView.actions.delete")}]
            </Button>
          </Div>
        )}
    </Div>
  );
}
