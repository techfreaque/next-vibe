/**
 * Flat Message View (4chan-style)
 * Displays messages in a chronological, flat layout with >>references
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import { Div, Markdown, Span } from "next-vibe-ui/ui";
import type { JSX } from "react";
import React, { useState } from "react";

import { Logo } from "@/app/[locale]/_components/nav/logo";
import { getModelById } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useTouchDevice } from "../../hooks/use-touch-device";
import {
  extractReferences,
  format4chanTimestamp,
  getIdColor,
  getShortId,
} from "../../lib/utils/formatting";
import { formatPostNumber, getPostNumber } from "../../lib/utils/post-numbers";
import type { ChatMessage, ChatThread, ModelId } from "../../types";
import { MessageEditor } from "./message-editor";
import { ModelPersonaSelectorModal } from "./model-persona-selector-modal";
import { ToolCallDisplay } from "./tool-call-display";
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
  rootFolderId?: string;
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
 * Render content with clickable >>references (post numbers)
 */
function renderContentWithReferences(
  content: string,
  postNumberToMessageId: Record<number, string>,
  onMessageClick?: (messageId: string) => void,
): JSX.Element {
  const parts: JSX.Element[] = [];
  const regex = />>\s*([0-9]+)/g; // Match >>1234567 style references
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(content)) !== null) {
    // Add text before the reference
    if (match.index > lastIndex) {
      parts.push(
        <Span key={`text-${key++}`}>
          {content.substring(lastIndex, match.index)}
        </Span>,
      );
    }

    // Add the reference as a clickable link
    const postNumber = parseInt(match[1], 10);
    const messageId = postNumberToMessageId[postNumber];

    parts.push(
      <button
        key={`ref-${key++}`}
        onClick={(): void => {
          if (messageId) {
            onMessageClick?.(messageId);
          }
        }}
        className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
      >
        {/* eslint-disable-next-line i18next/no-literal-string -- Technical 4chan-style reference syntax */}
        {`>>${postNumber}`}
      </button>,
    );

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(
      <Span key={`text-${key++}`}>{content.substring(lastIndex)}</Span>,
    );
  }

  return <>{parts}</>;
}

/**
 * Preview popup component for >>references
 */
function MessagePreview({
  message,
  shortId,
  position,
  locale,
  rootFolderId = "general",
}: {
  message: ChatMessage;
  shortId: string;
  position: { x: number; y: number };
  locale: CountryLanguage;
  rootFolderId?: string;
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
            isUser ? "text-green-400" : "text-blue-400",
          )}
        >
          {isUser
            ? rootFolderId === "general" ||
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
            <button
              key={post.id}
              onClick={(): void => {
                onPostClick?.(postShortId);
              }}
              className="w-full text-left p-2 rounded hover:bg-accent/50 transition-colors"
            >
              <Div className="text-xs text-muted-foreground mb-1">
                {/* eslint-disable-next-line i18next/no-literal-string -- Technical post number and separator */}
                {`Post #${idx + 1} • ${format4chanTimestamp(post.createdAt.getTime(), t)}`}
              </Div>
              <Div className="text-sm text-foreground/90 line-clamp-2">
                {post.content.substring(0, 100)}
                {post.content.length > 100 && "..."}
              </Div>
            </button>
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
  postNum: number;
  postNumberMap: Record<string, number>;
  postNumberToMessageId: Record<number, string>;
  messages: ChatMessage[];
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
  rootFolderId?: string;
}

function FlatMessage({
  message,
  postNum,
  postNumberMap,
  postNumberToMessageId,
  messages,
  personas,
  selectedModel,
  selectedPersona,
  locale,
  logger,
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
  onInsertQuote,
  rootFolderId = "general",
}: FlatMessageProps): JSX.Element {
  const { t } = simpleT(locale);

  // TTS support for assistant messages is handled by the message action buttons

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

  const displayName = isUser
    ? rootFolderId === "general" ||
      rootFolderId === "shared" ||
      rootFolderId === "public"
      ? t("app.chat.flatView.youLabel")
      : t("app.chat.flatView.anonymous")
    : modelDisplayName;

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
      {postNum === 1 && (
        <Div className="absolute top-3 right-3 pointer-events-none bg-background/60 backdrop-blur-xl rounded-md p-1.5 shadow-sm border border-border/10">
          <Logo
            className="h-auto w-auto max-w-[100px] opacity-70"
            locale={locale}
            pathName="/"
          />
        </Div>
      )}

      {/* Post Header */}
      <Div className="flex items-center gap-2.5 mb-3 flex-wrap">
        {/* Author Name with Model Icon */}
        <Span
          className={cn(
            "font-bold text-sm flex items-center gap-1.5",
            isUser ? "text-green-400" : "text-blue-400",
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
        <button
          className="px-2 py-0.5 rounded text-xs font-mono font-semibold shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
          style={{
            backgroundColor: `${idColor}15`,
            color: idColor,
            borderColor: `${idColor}40`,
            borderWidth: "1px",
          }}
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            onSetHoveredUserId(userId, {
              x: rect.left + rect.width / 2,
              y: rect.bottom,
            });
          }}
          onMouseLeave={() => {
            onSetHoveredUserId(null, null);
          }}
          title={t("app.chat.flatView.postsById", {
            count: countPostsByUserId(messages, userId),
          })}
        >
          {isUser
            ? t("app.chat.flatView.idLabel", { id: userId.substring(0, 8) })
            : personaDisplayName}
        </button>

        {/* Timestamp */}
        <Span className="text-muted-foreground/80 text-xs font-medium">
          {format4chanTimestamp(message.createdAt.getTime(), t)}
        </Span>

        {/* Post Number */}
        <button
          className="text-blue-400 hover:text-blue-300 text-xs font-semibold cursor-pointer hover:underline"
          onClick={(): void => {
            void navigator.clipboard.writeText(`>>${postNum}`);
          }}
          title={t("app.chat.flatView.clickToCopyRef")}
        >
          {formatPostNumber(postNum, locale)}
        </button>

        {/* Reply count badge */}
        {replyCount > 0 && (
          <Span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-xs font-bold border border-blue-500/30">
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </Span>
        )}

        {/* Reply indicator - Arrow symbol is technical, not user-facing text */}

        {references.length > 0 && (
          // eslint-disable-next-line i18next/no-literal-string -- Technical arrow symbol for reply indicator
          <Span className="text-blue-400/60 text-xs">▶</Span>
        )}
      </Div>

      {/* Replying To */}
      {message.parentId &&
        ((): JSX.Element | null => {
          const parentMsg = messages.find((m) => m.id === message.parentId);
          if (!parentMsg) {
            return null;
          }
          const parentPostNum = postNumberMap[parentMsg.id];
          return (
            <Div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Span>{t("app.chat.flatView.replyingTo")}</Span>
              <button
                onClick={() => {
                  const element = document.getElementById(`${parentPostNum}`);
                  element?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  onSetHoveredRef(parentPostNum.toString(), {
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  });
                }}
                onMouseLeave={(): void => {
                  onSetHoveredRef(null, null);
                }}
                className="text-blue-400 hover:text-blue-300 hover:underline font-semibold"
              >
                {/* eslint-disable-next-line i18next/no-literal-string -- Technical 4chan-style reference syntax */}
                {`>>${parentPostNum}`}
              </button>
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
                : async (): Promise<void> => {}
            }
            onCancel={messageActions.cancelAction}
            onModelChange={onModelChange}
            onPersonaChange={onPersonaChange}
            locale={locale}
            logger={logger}
          />
        </Div>
      ) : messageActions.retryingMessageId === message.id ? (
        <Div className="my-2">
          <ModelPersonaSelectorModal
            titleKey="app.chat.flatView.retryModal.title"
            descriptionKey="app.chat.flatView.retryModal.description"
            selectedModel={selectedModel}
            selectedPersona={selectedPersona}
            onModelChange={onModelChange || ((): void => {})}
            onPersonaChange={onPersonaChange || ((): void => {})}
            onConfirm={(): Promise<void> =>
              messageActions.handleConfirmRetry(message.id, onRetryMessage)
            }
            onCancel={messageActions.cancelAction}
            confirmLabelKey="app.chat.flatView.retryModal.confirmLabel"
            locale={locale}
            logger={logger}
          />
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
          {isAssistant ? (
            <Div
              className={cn(
                "prose prose-sm dark:prose-invert max-w-none",
                "prose-p:my-2 prose-p:leading-relaxed",
                "prose-code:text-blue-400 prose-code:bg-blue-950/40 prose-code:px-1 prose-code:rounded",
                "prose-pre:bg-black/60 prose-pre:border prose-pre:border-border/40 prose-pre:rounded-md",
                "prose-headings:text-foreground prose-headings:font-bold",
                "prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline",
              )}
            >
              {/* Tool calls display */}
              {message.toolCalls && message.toolCalls.length > 0 && (
                <ToolCallDisplay
                  toolCalls={message.toolCalls}
                  locale={locale}
                />
              )}

              <Markdown content={message.content} />
            </Div>
          ) : (
            <Div className="whitespace-pre-wrap break-words text-foreground/95">
              {renderContentWithReferences(
                message.content,
                postNumberToMessageId,
                (msgId): void => {
                  const targetPostNum = postNumberMap[msgId];

                  const element = document.getElementById(`${targetPostNum}`);
                  element?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                },
              )}
            </Div>
          )}
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
            onModelChange={onModelChange || ((): void => {})}
            onPersonaChange={onPersonaChange || ((): void => {})}
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
            const replyPostNum = postNumberMap[reply.id];
            return (
              <button
                key={reply.id}
                onClick={(): void => {
                  const element = document.getElementById(`${replyPostNum}`);
                  element?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
                onMouseEnter={(e): void => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  onSetHoveredRef(replyPostNum.toString(), {
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  });
                }}
                onMouseLeave={(): void => {
                  onSetHoveredRef(null, null);
                }}
                className="text-blue-400 hover:text-blue-300 hover:underline font-semibold"
              >
                {/* eslint-disable-next-line i18next/no-literal-string -- Technical 4chan-style reference syntax */}
                {`>>${replyPostNum}`}
              </button>
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
              <button
                onClick={(): void => messageActions.startEdit(message.id)}
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                title={t("app.chat.flatView.actions.replyToMessage")}
              >
                [{t("app.chat.flatView.actions.reply")}]
              </button>
            )}

            {/* Edit/Branch */}
            {isUser && onBranchMessage && (
              <button
                onClick={(): void => {
                  messageActions.startEdit(message.id);
                }}
                className="text-green-400 hover:text-green-300 hover:underline transition-colors"
                title={t("app.chat.flatView.actions.editMessage")}
              >
                [{t("app.chat.flatView.actions.edit")}]
              </button>
            )}

            {/* Retry */}
            {isUser && onRetryMessage && (
              <button
                onClick={(): void => {
                  messageActions.startRetry(message.id);
                }}
                className="text-yellow-400 hover:text-yellow-300 hover:underline transition-colors"
                title={t("app.chat.flatView.actions.retryWithDifferent")}
              >
                [{t("app.chat.flatView.actions.retry")}]
              </button>
            )}

            {/* Answer as AI - For both user and assistant messages */}
            {onAnswerAsModel && (
              <button
                onClick={(): void => {
                  messageActions.startAnswer(message.id);
                }}
                className="text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                title={
                  isAssistant
                    ? t("app.chat.threadedView.actions.respondToAI")
                    : t("app.chat.flatView.actions.generateAIResponse")
                }
              >
                [{t("app.chat.flatView.actions.answerAsAI")}]
              </button>
            )}

            {/* Quote */}
            {onInsertQuote && (
              <button
                onClick={onInsertQuote}
                className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                title={t("app.chat.flatView.actions.insertQuote")}
              >
                [{t("app.chat.flatView.actions.insertQuote")}]
              </button>
            )}

            {/* Copy Link */}
            <button
              onClick={(): void => {
                void navigator.clipboard.writeText(`>>${postNum}`);
              }}
              className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
              title={t("app.chat.flatView.actions.copyReference")}
            >
              [{t("app.chat.flatView.actions.copyReference")}]
            </button>

            {/* Delete */}
            {onDeleteMessage && (
              <button
                onClick={(): void => {
                  onDeleteMessage(message.id);
                }}
                className="px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
                title={t("app.chat.flatView.actions.deleteMessage")}
              >
                [{t("app.chat.flatView.actions.delete")}]
              </button>
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
  rootFolderId = "general",
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

  // Detect touch device for proper action visibility
  const isTouch = useTouchDevice();

  // Build post number maps
  const messageIds = messages.map((m) => m.id);
  const postNumberMap: Record<string, number> = {};
  const postNumberToMessageId: Record<number, string> = {};

  messageIds.forEach((id) => {
    const postNum = getPostNumber(id, logger);
    postNumberMap[id] = postNum;
    postNumberToMessageId[postNum] = id;
  });

  // Find message by post number for preview
  const previewMessage = hoveredRef
    ? messages.find((m) => postNumberMap[m.id].toString() === hoveredRef)
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

      {messages.map((message, index) => (
        <FlatMessage
          key={message.id}
          message={message}
          index={index}
          postNum={postNumberMap[message.id]}
          postNumberMap={postNumberMap}
          postNumberToMessageId={postNumberToMessageId}
          messages={messages}
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
        />
      ))}
    </Div>
  );
}
