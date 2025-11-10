/**
 * Flat Message View (4chan-style)
 * Displays messages in a chronological, flat layout with >>references
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import React, { useState } from "react";

import { Logo } from "@/app/[locale]/_components/logo";
import type { DefaultFolderId } from "@/app/api/[locale]/v1/core/agent/chat/config";
import { getModelById } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useTouchDevice } from "../../hooks/use-touch-device";
import {
  extractReferences,
  format4chanTimestamp,
  getIdColor,
  getShortId,
} from "../../lib/utils/formatting";
import { formatPostNumber } from "../../lib/utils/post-numbers";
import type { ChatMessage, ChatThread, ModelId } from "../../types";
import { MessageEditor } from "./message-editor";
import { groupMessagesBySequence } from "./message-grouping";
import { ModelPersonaSelectorModal } from "./model-persona-selector-modal";
import { ToolDisplay } from "./tool-display";
import { useCollapseState } from "./use-collapse-state";
import { useMessageActions } from "./use-message-actions";

interface FlatMessageViewProps {
  thread: ChatThread;
  messages: ChatMessage[];
  personas: Record<string, { id: string; name: string; icon: string }>;
  selectedModel: ModelId;
  selectedPersona: string;
  ttsAutoplay: boolean;
  locale: CountryLanguage;
  logger: EndpointLogger;
  onMessageClick?: (messageId: string) => void;
  onBranchMessage?: (messageId: string, newContent: string) => Promise<void>;
  onRetryMessage?: (messageId: string) => Promise<void>;
  onAnswerAsModel?: (messageId: string, content: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => void;
  onModelChange?: (model: ModelId) => void;
  onPersonaChange?: (persona: string) => void;
  onInsertQuote?: () => void; // Only inserts '>' character
  rootFolderId: DefaultFolderId;
  currentUserId?: string;
  deductCredits: (creditCost: number, feature: string) => void;
}

/**
 * Count how many messages are direct replies to this message
 * Uses message structure (parentId) instead of parsing content
 */
function countReplies(messages: ChatMessage[], messageId: string): number {
  return messages.filter((msg) => msg.parentId === messageId).length;
}

/**
 * Get direct replies to a message (children in the tree)
 */
function getDirectReplies(
  messages: ChatMessage[],
  messageId: string,
): ChatMessage[] {
  return messages.filter((m) => m.parentId === messageId);
}

/**
 * Count posts by a specific user ID
 */
function countPostsByUserId(messages: ChatMessage[], userId: string): number {
  return messages.filter((m) => m.authorId === userId).length;
}

/**
 * Get all posts by a specific user ID
 */
function getPostsByUserId(
  messages: ChatMessage[],
  userId: string,
): ChatMessage[] {
  return messages.filter((m) => m.authorId === userId);
}

/**
 * Preview popup component for >>references
 */
function MessagePreview({
  message,
  shortId,
  position,
  locale,
  rootFolderId = "private",
}: {
  message: ChatMessage;
  shortId: string;
  position: { x: number; y: number };
  locale: CountryLanguage;
  rootFolderId: DefaultFolderId;
}): JSX.Element {
  const { t } = simpleT(locale);
  const idColor = getIdColor(shortId);
  const isUser = message.role === "user";

  return (
    <Div
      className={cn(
        "fixed z-50 pointer-events-none",
        "max-w-md p-3 rounded-lg",
        "bg-background/95 backdrop-blur-sm",
        "border border-border shadow-xl",
        "animate-in fade-in-0 zoom-in-95 duration-150",
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -100%) translateY(-8px)",
      }}
    >
      {/* Preview Header */}
      <Div className="flex items-center gap-2 mb-2 text-xs">
        <Span
          className={cn(
            "font-semibold",
            isUser ? "text-foreground" : "text-primary",
          )}
        >
          {isUser
            ? rootFolderId === "private" ||
              rootFolderId === "shared" ||
              rootFolderId === "public"
              ? t("app.chat.flatView.youLabel")
              : t("app.chat.flatView.anonymous")
            : message.authorName || t("app.chat.flatView.assistantFallback")}
        </Span>
        <Span
          className="px-1.5 py-0.5 rounded text-xs font-mono"
          style={{
            backgroundColor: `${idColor}20`,
            color: idColor,
            borderColor: idColor,
            borderWidth: "1px",
          }}
        >
          {shortId}
        </Span>
      </Div>

      {/* Preview Content */}
      <Div className="text-sm text-foreground/90 line-clamp-4">
        {message.content}
      </Div>
    </Div>
  );
}

/**
 * User ID Hover Card - Shows post count and list
 */
function UserIdHoverCard({
  userId,
  messages,
  position,
  onPostClick,
  locale,
}: {
  userId: string;
  messages: ChatMessage[];
  position: { x: number; y: number };
  onPostClick?: (messageId: string) => void;
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = simpleT(locale);
  const userPosts = getPostsByUserId(messages, userId);
  const postCount = userPosts.length;
  const idColor = getIdColor(userId);

  return (
    <Div
      className={cn(
        "fixed z-50",
        "w-72 p-3 rounded-lg",
        "bg-background/95 backdrop-blur-md",
        "border border-border shadow-2xl",
        "animate-in fade-in-0 zoom-in-95 duration-150",
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y + 10}px`,
      }}
    >
      {/* Header */}
      <Div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
        <Span
          className="px-2 py-1 rounded text-xs font-mono font-semibold"
          style={{
            backgroundColor: `${idColor}20`,
            color: idColor,
            borderColor: idColor,

            borderWidth: "1px",
          }}
        >
          {/* eslint-disable-next-line i18next/no-literal-string -- Technical ID label */}
          {`ID: ${userId}`}
        </Span>
        <Span className="text-xs text-muted-foreground font-medium">
          {t("app.chat.flatView.postsById", { count: postCount })}
        </Span>
      </Div>

      {/* Post List */}
      <Div className="space-y-2 max-h-64 overflow-y-auto">
        {userPosts.map((post, idx) => {
          const postShortId = getShortId(post.id);
          return (
            <Button
              key={post.id}
              onClick={(): void => {
                onPostClick?.(postShortId);
              }}
              variant="ghost"
              size="unset"
              className="w-full text-left p-2 rounded hover:bg-accent transition-colors"
            >
              <Div className="text-xs text-muted-foreground mb-1">
                {/* eslint-disable-next-line i18next/no-literal-string -- Technical post number and separator */}
                {`Post #${idx + 1} • ${format4chanTimestamp(post.createdAt.getTime(), t)}`}
              </Div>
              <Div className="text-sm text-foreground/90 line-clamp-2">
                {post.content.substring(0, 100)}
                {post.content.length > 100 && "..."}
              </Div>
            </Button>
          );
        })}
      </Div>
    </Div>
  );
}

/**
 * Individual Flat Message Component with TTS support
 */
interface FlatMessageProps {
  message: ChatMessage;
  index: number;
  postNum: string;
  messages: ChatMessage[];
  messageGroup?: ReturnType<typeof groupMessagesBySequence>[0];
  personas: Record<string, { id: string; name: string; icon: string }>;
  selectedModel: ModelId;
  selectedPersona: string;
  ttsAutoplay: boolean;
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
  onBranchMessage?: (messageId: string, newContent: string) => Promise<void>;
  onRetryMessage?: (messageId: string) => Promise<void>;
  onAnswerAsModel?: (messageId: string, content: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => void;
  onModelChange?: (model: ModelId) => void;
  onPersonaChange?: (persona: string) => void;
  onInsertQuote?: () => void;
  rootFolderId: DefaultFolderId;
  /** Collapse state management callbacks */
  collapseState?: ReturnType<typeof useCollapseState>;
  currentUserId?: string;
  deductCredits: (creditCost: number, feature: string) => void;
}

function FlatMessage({
  message,
  postNum,
  messages,
  messageGroup,
  personas,
  selectedModel,
  selectedPersona,
  locale,
  logger,
  index,
  messageActions,
  isTouch,
  hoveredRef,
  onSetHoveredRef,
  onSetHoveredUserId,
  onBranchMessage,
  onRetryMessage,
  onAnswerAsModel,
  onDeleteMessage,
  onModelChange,
  onPersonaChange,
  rootFolderId: _rootFolderId = "private",
  collapseState,
  currentUserId,
  deductCredits,
}: FlatMessageProps): JSX.Element {
  const { t } = simpleT(locale);

  // TTS support for assistant messages is handled by the message action buttons

  // Get all messages in the sequence (primary + continuations)
  const allMessagesInSequence = messageGroup
    ? [messageGroup.primary, ...messageGroup.continuations].toSorted(
        (a, b) => (a.sequenceIndex ?? 0) - (b.sequenceIndex ?? 0),
      )
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
  // Get persona name from personas map (fetched from server)
  const personaDisplayName =
    (message.role === "user" || message.role === "assistant") && message.persona
      ? personas[message.persona]?.name || message.persona
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
              const ModelIcon = modelData.icon;
              return typeof ModelIcon === "string" ? (
                <Span className="text-base leading-none">{ModelIcon}</Span>
              ) : (
                <ModelIcon className="h-3.5 w-3.5" />
              );
            })()}
          {displayName}
        </Span>

        {/* ID Badge - Hoverable */}
        <Div
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
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
              ? t("app.chat.flatView.idLabel", { id: userId.substring(0, 8) })
              : personaDisplayName}
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
              <Span
                onMouseEnter={(e: React.MouseEvent<HTMLSpanElement>) => {
                  const rect = e.currentTarget.getBoundingClientRect();
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
              </Span>
            </Div>
          );
        })()}

      {/* Message Content */}
      {messageActions.editingMessageId === message.id ? (
        <Div className="my-2">
          <MessageEditor
            message={message}
            selectedModel={selectedModel}
            selectedPersona={selectedPersona}
            onBranch={
              onBranchMessage
                ? (id, content): Promise<void> =>
                    messageActions.handleBranchEdit(
                      id,
                      content,
                      onBranchMessage,
                    )
                : async (): Promise<void> => {
                    logger.warn(
                      "FlatMessageView",
                      "Branch operation not available - onBranchMessage handler not provided",
                    );
                  }
            }
            onCancel={messageActions.cancelAction}
            onModelChange={onModelChange}
            onPersonaChange={onPersonaChange}
            locale={locale}
            logger={logger}
            deductCredits={deductCredits}
          />
        </Div>
      ) : messageActions.retryingMessageId === message.id ? (
        <Div className="my-2">
          <ModelPersonaSelectorModal
            titleKey="app.chat.flatView.retryModal.title"
            descriptionKey="app.chat.flatView.retryModal.description"
            selectedModel={selectedModel}
            selectedPersona={selectedPersona}
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
            onPersonaChange={
              onPersonaChange ||
              ((persona: string): void => {
                logger.debug(
                  "FlatMessageView",
                  "Persona selection changed (no handler)",
                  { persona },
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
          {/* NEW ARCHITECTURE: TOOL messages have toolCalls in metadata */}
          {message.toolCalls && message.toolCalls.length > 0 && (
            <ToolDisplay
              toolCalls={message.toolCalls}
              locale={locale}
              hasContent={false}
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
            if (msg.role === "tool" && msg.toolCalls) {
              return (
                <ToolDisplay
                  key={msg.id}
                  toolCalls={msg.toolCalls}
                  locale={locale}
                  hasContent={hasContentAfter}
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
                  <Markdown
                    content={msg.content}
                    messageId={msg.id}
                  />
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
            selectedModel={selectedModel}
            selectedPersona={selectedPersona}
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
            onPersonaChange={
              onPersonaChange ||
              ((persona: string): void => {
                logger.debug(
                  "FlatMessageView",
                  "Persona selection changed (no handler)",
                  { persona },
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
                onMouseEnter={(e: React.MouseEvent<HTMLSpanElement>) => {
                  const rect = e.currentTarget.getBoundingClientRect();
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
            {onBranchMessage && (
              <Button
                variant="ghost"
                size="unset"
                onClick={(): void => messageActions.startEdit(message.id)}
                className="text-primary hover:text-primary/80 hover:underline transition-colors"
                title={t("app.chat.flatView.actions.replyToMessage")}
              >
                [{t("app.chat.flatView.actions.reply")}]
              </Button>
            )}

            {/* Edit/Branch */}
            {isUser && onBranchMessage && (
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
            {isUser && onRetryMessage && (
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
            {onAnswerAsModel && (
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
            )}

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
            {onDeleteMessage && (
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
            )}
          </Div>
        )}
    </Div>
  );
}

export function FlatMessageView({
  messages,
  personas,
  selectedModel,
  selectedPersona,
  ttsAutoplay,
  locale,
  logger,
  onBranchMessage,
  onRetryMessage,
  onAnswerAsModel,
  onDeleteMessage,
  onModelChange,
  onPersonaChange,
  onInsertQuote: _onInsertQuote,
  rootFolderId = "private",
  currentUserId,
  deductCredits,
}: FlatMessageViewProps): JSX.Element {
  const [hoveredRef, setHoveredRef] = useState<string | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [userIdPosition, setUserIdPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Use message actions hook for edit/retry/answer states
  const messageActions = useMessageActions(logger);

  // Collapse state management for thinking/tool sections
  const collapseState = useCollapseState();

  // Detect touch device for proper action visibility
  const isTouch = useTouchDevice();

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

  // Find message by post number for preview
  const previewMessage = hoveredRef
    ? messages.find((m) => m.id.split("-")[0] === hoveredRef)
    : null;

  return (
    <Div className="space-y-4">
      {/* Preview Popup */}
      {previewMessage && hoveredRef && previewPosition && (
        <MessagePreview
          message={previewMessage}
          shortId={hoveredRef}
          position={previewPosition}
          locale={locale}
          rootFolderId={rootFolderId}
        />
      )}

      {/* User ID Hover Card */}
      {hoveredUserId && userIdPosition && (
        <UserIdHoverCard
          userId={hoveredUserId}
          messages={messages}
          position={userIdPosition}
          locale={locale}
          onPostClick={(postId): void => {
            const element = document.getElementById(`${postId}`);
            element?.scrollIntoView({ behavior: "smooth", block: "center" });
            setHoveredUserId(null);
          }}
        />
      )}

      {messages.map((message, index) => {
        // Check if this is a continuation message (part of a sequence but not the primary)
        const group = messageToGroupMap.get(message.id);
        const isContinuation = group && group.primary.id !== message.id;

        // Skip rendering continuation messages - they'll be rendered with their primary
        if (isContinuation) {
          return null;
        }

        return (
          <FlatMessage
            key={message.id}
            message={message}
            index={index}
            postNum={message.id.split("-")[0]}
            messages={messages}
            messageGroup={group}
            personas={personas}
            selectedModel={selectedModel}
            selectedPersona={selectedPersona}
            ttsAutoplay={ttsAutoplay}
            locale={locale}
            logger={logger}
            messageActions={messageActions}
            isTouch={isTouch}
            hoveredRef={hoveredRef}
            onSetHoveredRef={(ref, pos) => {
              setHoveredRef(ref);
              setPreviewPosition(pos);
            }}
            onSetHoveredUserId={(userId, pos) => {
              setHoveredUserId(userId);
              setUserIdPosition(pos);
            }}
            onBranchMessage={onBranchMessage}
            onRetryMessage={onRetryMessage}
            onAnswerAsModel={onAnswerAsModel}
            onDeleteMessage={onDeleteMessage}
            onModelChange={onModelChange}
            onPersonaChange={onPersonaChange}
            onInsertQuote={_onInsertQuote}
            rootFolderId={rootFolderId}
            collapseState={collapseState}
            currentUserId={currentUserId}
            deductCredits={deductCredits}
          />
        );
      })}
    </Div>
  );
}
