/**
 * Flat Message View (4chan-style)
 * Displays messages in a chronological, flat layout with >>references
 */

"use client";

import Image from "next/image";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React, { useState } from "react";

import { useTranslation } from "@/i18n/core/client";
import { Markdown } from "@/packages/next-vibe-ui/web/ui/markdown";

import logo from "../../../_components/nav/bottled.ai-logo.png";
import { useTouchDevice } from "../../hooks/use-touch-device";
import type { ModelId } from "../../lib/config/models";
import { getModelById } from "../../lib/config/models";
import { getPersonaName } from "../../lib/config/personas";
import type { ChatMessage, ChatThread } from "../../lib/storage/types";
import {
  extractReferences,
  format4chanTimestamp,
  getIdColor,
  getShortId,
} from "../../lib/utils/formatting";
import { formatPostNumber, getPostNumber } from "../../lib/utils/post-numbers";
import { MessageEditor } from "./message-editor";
import { ModelPersonaSelectorModal } from "./model-persona-selector-modal";
import { useMessageActions } from "./use-message-actions";

interface FlatMessageViewProps {
  thread: ChatThread;
  messages: ChatMessage[];
  selectedModel: ModelId;
  selectedTone: string;
  onMessageClick?: (messageId: string) => void;
  onBranchMessage?: (messageId: string, newContent: string) => Promise<void>;
  onRetryMessage?: (messageId: string) => Promise<void>;
  onAnswerAsModel?: (messageId: string) => Promise<void>;
  onDeleteMessage?: (messageId: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => Promise<void>;
  onModelChange?: (model: ModelId) => void;
  onToneChange?: (tone: string) => void;
  onInsertQuote?: () => void; // Only inserts '>' character
}

/**
 * Count how many messages reference this message by post number
 */
function countReplies(
  messages: ChatMessage[],
  targetPostNumber: number,
): number {
  let count = 0;
  for (const msg of messages) {
    const refs = extractReferences(msg.content);
    // Check if content references the target post number
    if (refs.some((ref) => ref === targetPostNumber.toString())) {
      count++;
    }
  }
  return count;
}

/**
 * Get backlinks (messages that reference this message) by post number
 */
function getBacklinks(
  messages: ChatMessage[],
  targetPostNumber: number,
  postNumberMap: Record<string, number>,
): number[] {
  const backlinks: number[] = [];
  for (const msg of messages) {
    const refs = extractReferences(msg.content);
    if (refs.some((ref) => ref === targetPostNumber.toString())) {
      backlinks.push(postNumberMap[msg.id]);
    }
  }
  return backlinks;
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
  return messages.filter((m) => m.author?.id === userId).length;
}

/**
 * Get all posts by a specific user ID
 */
function getPostsByUserId(
  messages: ChatMessage[],
  userId: string,
): ChatMessage[] {
  return messages.filter((m) => m.author?.id === userId);
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
        <span key={`text-${key++}`}>
          {content.substring(lastIndex, match.index)}
        </span>,
      );
    }

    // Add the reference as a clickable link
    const postNumber = parseInt(match[1], 10);
    const messageId = postNumberToMessageId[postNumber];
    parts.push(
      <button
        key={`ref-${key++}`}
        onClick={() => messageId && onMessageClick?.(messageId)}
        className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
      >
        &gt;&gt;{postNumber}
      </button>,
    );

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(
      <span key={`text-${key++}`}>{content.substring(lastIndex)}</span>,
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
}: {
  message: ChatMessage;
  shortId: string;
  position: { x: number; y: number };
}): JSX.Element {
  const idColor = getIdColor(shortId);
  const isUser = message.role === "user";

  return (
    <div
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
      <div className="flex items-center gap-2 mb-2 text-xs">
        <span
          className={cn(
            "font-semibold",
            isUser ? "text-green-400" : "text-blue-400",
          )}
        >
          {isUser ? "You" : message.author?.name || "Assistant"}
        </span>
        <span
          className="px-1.5 py-0.5 rounded text-xs font-mono"
          style={{
            backgroundColor: `${idColor}20`,
            color: idColor,
            borderColor: idColor,
            borderWidth: "1px",
          }}
        >
          {shortId}
        </span>
      </div>

      {/* Preview Content */}
      <div className="text-sm text-foreground/90 line-clamp-4">
        {message.content}
      </div>
    </div>
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
}: {
  userId: string;
  messages: ChatMessage[];
  position: { x: number; y: number };
  onPostClick?: (messageId: string) => void;
}): JSX.Element {
  const userPosts = getPostsByUserId(messages, userId);
  const postCount = userPosts.length;
  const idColor = getIdColor(userId);

  return (
    <div
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
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
        <span
          className="px-2 py-1 rounded text-xs font-mono font-semibold"
          style={{
            backgroundColor: `${idColor}20`,
            color: idColor,
            borderColor: idColor,
            borderWidth: "1px",
          }}
        >
          ID: {userId}
        </span>
        <span className="text-xs text-muted-foreground font-medium">
          {postCount} {postCount === 1 ? "post" : "posts"}
        </span>
      </div>

      {/* Post List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {userPosts.map((post, idx) => {
          const postShortId = getShortId(post.id);
          return (
            <button
              key={post.id}
              onClick={() => onPostClick?.(postShortId)}
              className="w-full text-left p-2 rounded hover:bg-accent/50 transition-colors"
            >
              <div className="text-xs text-muted-foreground mb-1">
                Post #{idx + 1} • {format4chanTimestamp(post.timestamp)}
              </div>
              <div className="text-sm text-foreground/90 line-clamp-2">
                {post.content.substring(0, 100)}
                {post.content.length > 100 && "..."}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FlatMessageView({
  thread: _thread,
  messages,
  selectedModel,
  selectedTone,
  onMessageClick: _onMessageClick,
  onBranchMessage,
  onRetryMessage,
  onAnswerAsModel,
  onDeleteMessage,
  onEditMessage,
  onModelChange,
  onToneChange,
  onInsertQuote,
}: FlatMessageViewProps): JSX.Element {
  const { t } = useTranslation("chat");
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
  const messageActions = useMessageActions();

  // Detect touch device for proper action visibility
  const isTouch = useTouchDevice();

  // Build post number maps
  const messageIds = messages.map((m) => m.id);
  const postNumberMap: Record<string, number> = {};
  const postNumberToMessageId: Record<number, string> = {};

  messageIds.forEach((id) => {
    const postNum = getPostNumber(id);
    postNumberMap[id] = postNum;
    postNumberToMessageId[postNum] = id;
  });

  // Find message by post number for preview
  const previewMessage = hoveredRef
    ? messages.find((m) => postNumberMap[m.id].toString() === hoveredRef)
    : null;

  return (
    <div className="space-y-4">
      {/* Preview Popup */}
      {previewMessage && hoveredRef && previewPosition && (
        <MessagePreview
          message={previewMessage}
          shortId={hoveredRef}
          position={previewPosition}
        />
      )}

      {/* User ID Hover Card */}
      {hoveredUserId && userIdPosition && (
        <UserIdHoverCard
          userId={hoveredUserId}
          messages={messages}
          position={userIdPosition}
          onPostClick={(postId) => {
            const element = document.getElementById(`msg-${postId}`);
            element?.scrollIntoView({ behavior: "smooth", block: "center" });
            setHoveredUserId(null);
          }}
        />
      )}

      {messages.map((message, index) => {
        const postNum = postNumberMap[message.id];

        // User ID logic:
        // For user messages: use author.id if available, otherwise "local-user"
        // For AI messages: use model ID as the "user" ID
        const userId =
          message.role === "user"
            ? message.author?.id || "local-user"
            : message.role === "assistant" && message.model
              ? message.model
              : "assistant";

        const idColor = getIdColor(userId);
        const isUser = message.role === "user";
        const isAssistant = message.role === "assistant";

        // Get display names
        const modelDisplayName =
          message.role === "assistant" && message.model
            ? getModelById(message.model).name
            : "Assistant";
        const personaDisplayName =
          (message.role === "user" || message.role === "assistant") &&
          message.tone
            ? getPersonaName(message.tone)
            : "default";

        // Display name logic (4chan style):
        // User: "Anonymous" (like 4chan)
        // AI: "ModelName" only (persona shown separately)
        const displayName = isUser ? "Anonymous" : modelDisplayName;

        const references = extractReferences(message.content);
        const replyCount = countReplies(messages, postNum);
        const backlinks = getBacklinks(messages, postNum, postNumberMap);
        const isHighlighted = hoveredRef === postNum.toString();
        const directReplies = getDirectReplies(messages, message.id);

        return (
          <div
            key={message.id}
            id={`msg-${postNum}`}
            className={cn(
              "group/post relative",
              "p-3 mb-2 rounded",
              "transition-all duration-150",
              isHighlighted && "bg-blue-500/5",
            )}
          >
            {/* Logo Watermark - Only on first message */}
            {index === 0 && (
              <div className="absolute top-2 right-2 opacity-30 hover:opacity-50 transition-opacity pointer-events-none">
                <Image
                  src={logo}
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-auto w-auto max-w-[120px]"
                  priority
                />
              </div>
            )}

            {/* Post Header */}
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              {/* Author Name - 4chan style: "Anonymous" for user, "ModelName" for AI */}
              <span
                className={cn(
                  "font-bold text-sm",
                  isUser ? "text-green-400" : "text-blue-400",
                )}
              >
                {displayName}
              </span>

              {/* ID Badge - Hoverable */}
              {/* For user: show user ID, For AI: show persona */}
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
                  setHoveredUserId(userId);
                  setUserIdPosition({
                    x: rect.left + rect.width / 2,
                    y: rect.bottom,
                  });
                }}
                onMouseLeave={() => {
                  setHoveredUserId(null);
                  setUserIdPosition(null);
                }}
                title={`${countPostsByUserId(messages, userId)} posts by this ID`}
              >
                {isUser ? `ID: ${userId.substring(0, 8)}` : personaDisplayName}
              </button>

              {/* Timestamp */}
              <span className="text-muted-foreground/80 text-xs font-medium">
                {format4chanTimestamp(message.timestamp)}
              </span>

              {/* Post Number */}
              <button
                className="text-blue-400 hover:text-blue-300 text-xs font-semibold cursor-pointer hover:underline"
                onClick={() => {
                  // Copy >>postNum to clipboard
                  navigator.clipboard.writeText(`>>${postNum}`);
                }}
                title="Click to copy reference"
              >
                {formatPostNumber(postNum)}
              </button>

              {/* Reply count badge */}
              {replyCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-xs font-bold border border-blue-500/30">
                  {replyCount} {replyCount === 1 ? "reply" : "replies"}
                </span>
              )}

              {/* Reply indicator (if has references) */}
              {references.length > 0 && (
                <span className="text-blue-400/60 text-xs">▶</span>
              )}
            </div>

            {/* Replying To (parent message) */}
            {message.parentId &&
              (() => {
                const parentMsg = messages.find(
                  (m) => m.id === message.parentId,
                );
                if (!parentMsg) {
                  return null;
                }
                const parentPostNum = postNumberMap[parentMsg.id];
                return (
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Replying to:</span>
                    <button
                      onClick={() => {
                        const element = document.getElementById(
                          `msg-${parentPostNum}`,
                        );
                        element?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }}
                      onMouseEnter={(e) => {
                        setHoveredRef(parentPostNum.toString());
                        const rect = e.currentTarget.getBoundingClientRect();
                        setPreviewPosition({
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredRef(null);
                        setPreviewPosition(null);
                      }}
                      className="text-blue-400 hover:text-blue-300 hover:underline font-semibold"
                    >
                      &gt;&gt;{parentPostNum}
                    </button>
                  </div>
                );
              })()}

            {/* Message Content - with edit/retry/answer states */}
            {messageActions.editingMessageId === message.id ? (
              // Editing state
              <div className="my-2">
                <MessageEditor
                  message={message}
                  selectedModel={selectedModel}
                  selectedTone={selectedTone}
                  onSave={
                    onEditMessage
                      ? (id, content) =>
                          messageActions.handleSaveEdit(
                            id,
                            content,
                            onEditMessage,
                          )
                      : async () => {}
                  }
                  onCancel={messageActions.cancelAction}
                  onModelChange={onModelChange}
                  onToneChange={onToneChange}
                  onBranch={
                    onBranchMessage
                      ? (id, content) =>
                          messageActions.handleBranchEdit(
                            id,
                            content,
                            onBranchMessage,
                          )
                      : undefined
                  }
                />
              </div>
            ) : messageActions.retryingMessageId === message.id ? (
              // Retrying state
              <div className="my-2">
                <ModelPersonaSelectorModal
                  title="Retry with Different Settings"
                  description="Choose a model and persona to regenerate the response"
                  selectedModel={selectedModel}
                  selectedTone={selectedTone}
                  onModelChange={onModelChange || (() => {})}
                  onToneChange={onToneChange || (() => {})}
                  onConfirm={() =>
                    messageActions.handleConfirmRetry(
                      message.id,
                      onRetryMessage,
                    )
                  }
                  onCancel={messageActions.cancelAction}
                  confirmLabel="Retry"
                />
              </div>
            ) : messageActions.answeringMessageId === message.id ? (
              // Answering state
              <div className="my-2">
                <ModelPersonaSelectorModal
                  title="Answer as AI Model"
                  description="Choose a model and persona to generate an AI response"
                  selectedModel={selectedModel}
                  selectedTone={selectedTone}
                  onModelChange={onModelChange || (() => {})}
                  onToneChange={onToneChange || (() => {})}
                  onConfirm={() =>
                    messageActions.handleConfirmAnswer(
                      message.id,
                      onAnswerAsModel,
                    )
                  }
                  onCancel={messageActions.cancelAction}
                  confirmLabel="Generate"
                />
              </div>
            ) : (
              // Normal display - 4chan style with border around message
              <div
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
                  <div
                    className={cn(
                      "prose prose-sm dark:prose-invert max-w-none",
                      "prose-p:my-2 prose-p:leading-relaxed",
                      "prose-code:text-blue-400 prose-code:bg-blue-950/40 prose-code:px-1 prose-code:rounded",
                      "prose-pre:bg-black/60 prose-pre:border prose-pre:border-border/40 prose-pre:rounded-md",
                      "prose-headings:text-foreground prose-headings:font-bold",
                      "prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline",
                    )}
                  >
                    <Markdown content={message.content} />
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap break-words text-foreground/95">
                    {renderContentWithReferences(
                      message.content,
                      postNumberToMessageId,
                      (msgId) => {
                        const targetPostNum = postNumberMap[msgId];
                        const element = document.getElementById(
                          `msg-${targetPostNum}`,
                        );
                        element?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      },
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Backlinks (posts that reply to this one) */}
            {backlinks.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Replies:</span>
                {backlinks.map((backlinkPostNum, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const element = document.getElementById(
                        `msg-${backlinkPostNum}`,
                      );
                      element?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }}
                    onMouseEnter={(e) => {
                      setHoveredRef(backlinkPostNum.toString());
                      const rect = e.currentTarget.getBoundingClientRect();
                      setPreviewPosition({
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                      });
                    }}
                    onMouseLeave={() => {
                      setHoveredRef(null);
                      setPreviewPosition(null);
                    }}
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    &gt;&gt;{backlinkPostNum}
                  </button>
                ))}
              </div>
            )}

            {/* Direct Replies (children in tree) - 4chan style with post numbers */}
            {directReplies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="text-muted-foreground">Replies:</span>
                {directReplies.map((reply) => {
                  const replyPostNum = postNumberMap[reply.id];
                  return (
                    <button
                      key={reply.id}
                      onClick={() => {
                        const element = document.getElementById(
                          `msg-${replyPostNum}`,
                        );
                        element?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }}
                      onMouseEnter={(e) => {
                        setHoveredRef(replyPostNum.toString());
                        const rect = e.currentTarget.getBoundingClientRect();
                        setPreviewPosition({
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredRef(null);
                        setPreviewPosition(null);
                      }}
                      className="text-blue-400 hover:text-blue-300 hover:underline font-semibold"
                    >
                      &gt;&gt;{replyPostNum}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Post Actions (4chan-style) - Simple text links */}
            {!messageActions.editingMessageId &&
              !messageActions.retryingMessageId &&
              !messageActions.answeringMessageId && (
                <div
                  className={cn(
                    "mt-3 flex items-center gap-3 text-xs flex-wrap",
                    "transition-opacity duration-200",
                    // Touch devices: always visible but slightly transparent
                    // Pointer devices: hidden until hover
                    isTouch
                      ? "opacity-70 active:opacity-100"
                      : "opacity-0 group-hover/post:opacity-100 focus-within:opacity-100",
                  )}
                >
                  {/* Reply - Creates a branch from this message */}
                  {onBranchMessage && (
                    <button
                      onClick={() => onBranchMessage(message.id, "")}
                      className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                      title="Reply to this message (creates a branch)"
                    >
                      [Reply]
                    </button>
                  )}

                  {/* Edit/Branch - For user messages */}
                  {isUser && onBranchMessage && (
                    <button
                      onClick={() => messageActions.startEdit(message.id)}
                      className="text-green-400 hover:text-green-300 hover:underline transition-colors"
                      title="Edit this message (creates a branch)"
                    >
                      [Edit]
                    </button>
                  )}

                  {/* Retry - For user messages */}
                  {isUser && onRetryMessage && (
                    <button
                      onClick={() => messageActions.startRetry(message.id)}
                      className="text-yellow-400 hover:text-yellow-300 hover:underline transition-colors"
                      title="Retry with different model/tone"
                    >
                      [Retry]
                    </button>
                  )}

                  {/* Answer as Model - For user messages */}
                  {isUser && onAnswerAsModel && (
                    <button
                      onClick={() => messageActions.startAnswer(message.id)}
                      className="text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                      title="Generate AI response"
                    >
                      [Answer as AI]
                    </button>
                  )}

                  {/* Quote - Only inserts '>' character */}
                  {onInsertQuote && (
                    <button
                      onClick={onInsertQuote}
                      className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                      title="Insert quote character '>'"
                    >
                      [Quote]
                    </button>
                  )}

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`>>${postNum}`);
                    }}
                    className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
                    title="Copy reference link"
                  >
                    [Copy Link]
                  </button>

                  {onDeleteMessage && (
                    <button
                      onClick={() => onDeleteMessage(message.id)}
                      className="px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
                      title={t("actions.deleteThisMessage")}
                    >
                      [Delete]
                    </button>
                  )}
                </div>
              )}
          </div>
        );
      })}
    </div>
  );
}
