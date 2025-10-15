"use client";

import {
  ArrowBigUp,
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  MessageSquare,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React, { useState } from "react";

import { Markdown } from "@/packages/next-vibe-ui/web/ui/markdown";

import logo from "../../../_components/nav/bottled.ai-logo.png";
import { useTouchDevice } from "../../hooks/use-touch-device";
import type { ModelId } from "../../lib/config/models";
import { getModelById } from "../../lib/config/models";
import { getPersonaName } from "../../lib/config/personas";
import { chatAnimations } from "../../lib/design-tokens";
import type { ChatMessage } from "../../lib/storage/types";
import { getDirectReplies } from "../../lib/utils/thread-builder";
import { ErrorMessageBubble } from "./error-message-bubble";
import { MessageEditor } from "./message-editor";
import { ModelPersonaSelectorModal } from "./model-persona-selector-modal";
import { useMessageActions } from "./use-message-actions";
import { UserProfileCard } from "./user-profile-card";

interface ThreadedMessageProps {
  message: ChatMessage;
  replies: ChatMessage[];
  allMessages: ChatMessage[];
  depth: number;
  selectedModel: ModelId;
  selectedTone: string;
  onEditMessage: (messageId: string, newContent: string) => Promise<void>;
  onDeleteMessage: (messageId: string) => void;
  onBranchMessage?: (messageId: string, newContent: string) => Promise<void>;
  onRetryMessage?: (messageId: string) => Promise<void>;
  onAnswerAsModel?: (messageId: string) => Promise<void>;
  onModelChange?: (model: ModelId) => void;
  onToneChange?: (tone: string) => void;
  maxDepth?: number;
}

export function ThreadedMessage({
  message,
  replies,
  allMessages,
  depth,
  selectedModel,
  selectedTone,
  onEditMessage,
  onDeleteMessage,
  onBranchMessage,
  onRetryMessage,
  onAnswerAsModel,
  onModelChange,
  onToneChange,
  maxDepth = 8,
}: ThreadedMessageProps): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDeepReplies, setShowDeepReplies] = useState(false);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [userCardPosition, setUserCardPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Use custom hook for message action state management
  const messageActions = useMessageActions();

  // Detect touch device for proper action visibility
  const isTouch = useTouchDevice();

  const hasReplies = replies.length > 0;
  const isEditing = messageActions.isEditing(message.id);
  const isRetrying = messageActions.isRetrying(message.id);
  const isAnswering = messageActions.isAnswering(message.id);

  // Minimal fixed indent - just 16px for any nested level (no increase with depth)
  const indent = depth > 0 ? 16 : 0;

  return (
    <div className={cn(chatAnimations.slideIn, "relative")}>
      {/* Thread connector line - vertical line on the left */}
      {depth > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/30 via-blue-500/20 to-transparent"
          style={{ marginLeft: `${indent - 8}px` }}
        />
      )}

      {/* Message container */}
      <div
        className={cn("relative group/thread-item", depth > 0 && "pl-4")}
        style={{ paddingLeft: depth > 0 ? `${indent}px` : "0" }}
      >
        {/* Collapse/Expand button for messages with replies */}
        {hasReplies && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "absolute top-4 z-10",
              "h-5 w-5 rounded",
              "bg-background/80 backdrop-blur-sm border border-border/60",
              "flex items-center justify-center",
              "hover:bg-blue-500/10 hover:border-blue-500/40 transition-all",
              "text-muted-foreground hover:text-blue-400",
              "shadow-sm",
            )}
            style={{ left: depth > 0 ? `${indent - 26}px` : "-26px" }}
            title={isCollapsed ? "Expand replies" : "Collapse replies"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        )}

        {/* Message content */}
        <div id={`thread-msg-${message.id}`} className="group/message relative">
          {/* Collapsed state indicator */}
          {isCollapsed && hasReplies && (
            <div className="absolute -bottom-2 left-0 right-0 h-8 flex items-center justify-center">
              <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-medium flex items-center gap-2">
                <ChevronRight className="h-3 w-3" />
                <span>
                  {replies.length} hidden{" "}
                  {replies.length === 1 ? "reply" : "replies"}
                </span>
              </div>
            </div>
          )}

          {isEditing ? (
            <div
              className={cn(message.role === "user" ? "flex justify-end" : "")}
            >
              <MessageEditor
                message={message}
                selectedModel={selectedModel}
                selectedTone={selectedTone}
                onSave={(id, content) =>
                  messageActions.handleSaveEdit(id, content, onEditMessage)
                }
                onCancel={messageActions.cancelAction}
                onModelChange={onModelChange}
                onToneChange={onToneChange}
                onBranch={(id, content) =>
                  messageActions.handleBranchEdit(id, content, onBranchMessage)
                }
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
                onConfirm={() =>
                  messageActions.handleConfirmRetry(message.id, onRetryMessage)
                }
                onCancel={messageActions.cancelAction}
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
              onConfirm={() =>
                messageActions.handleConfirmAnswer(message.id, onAnswerAsModel)
              }
              onCancel={messageActions.cancelAction}
              confirmLabel="Generate"
            />
          ) : (
            <>
              {/* Custom Reddit-style message rendering */}
              <div
                className={cn(
                  "group/message p-4 rounded-lg",
                  "bg-background/40 backdrop-blur-sm",
                  "border border-border/30",
                  "hover:border-border/50 transition-all",
                  "relative",
                )}
              >
                {/* Logo watermark for first message */}
                {depth === 0 && !message.parentId && (
                  <div className="absolute top-3 right-3 opacity-30 pointer-events-none">
                    <Image
                      src={logo}
                      alt="Logo"
                      width={60}
                      height={20}
                      className="h-auto w-auto max-w-[60px]"
                      priority
                    />
                  </div>
                )}

                {/* Message header */}
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground flex-wrap">
                  <button
                    className={cn(
                      "font-semibold hover:underline cursor-pointer",
                      message.role === "user"
                        ? "text-green-400"
                        : "text-blue-400",
                    )}
                    onMouseEnter={(e) => {
                      if (message.author?.id) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredUserId(message.author.id);
                        setUserCardPosition({
                          x: rect.left + rect.width / 2,
                          y: rect.bottom,
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredUserId(null);
                      setUserCardPosition(null);
                    }}
                  >
                    {message.role === "user"
                      ? "You"
                      : message.model
                        ? getModelById(message.model).name
                        : "Assistant"}
                  </button>

                  {/* Persona/Tone - only for AI messages */}
                  {message.role === "assistant" && message.tone && (
                    <>
                      <span>•</span>
                      <span className="text-muted-foreground/80">
                        {getPersonaName(message.tone)}
                      </span>
                    </>
                  )}

                  <span>•</span>
                  <span>{new Date(message.timestamp).toLocaleString()}</span>
                </div>

                {/* Message content */}
                <div className="text-sm">
                  {message.role === "assistant" ? (
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
                      {message.content}
                    </div>
                  )}
                </div>
              </div>

              {message.role === "error" && (
                <ErrorMessageBubble message={message} />
              )}
            </>
          )}

          {/* Reddit-style action bar - All features */}
          {!isEditing && !isRetrying && !isAnswering && (
            <div
              className={cn(
                "flex items-center gap-2 mt-3 text-xs font-medium flex-wrap transition-opacity",
                // Touch devices: always visible but slightly transparent
                // Pointer devices: hidden until hover
                isTouch
                  ? "opacity-70 active:opacity-100"
                  : "opacity-0 group-hover/message:opacity-100 focus-within:opacity-100",
              )}
            >
              {/* Upvote button (visual only for now) */}
              <button
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-all"
                title="Upvote"
              >
                <ArrowBigUp className="h-4 w-4" />
                <span className="text-xs">Vote</span>
              </button>

              {/* Reply button - Creates a branch from this message */}
              {onBranchMessage && (
                <button
                  onClick={() => onBranchMessage(message.id, "")}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-all"
                  title="Reply to this message (creates a branch)"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Reply</span>
                </button>
              )}

              {/* Edit - For user messages */}
              {message.role === "user" && onBranchMessage && (
                <button
                  onClick={() => messageActions.startEdit(message.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-green-500/10 text-muted-foreground hover:text-green-400 transition-all"
                  title="Edit this message (creates a branch)"
                >
                  <span>Edit</span>
                </button>
              )}

              {/* Retry - For user messages */}
              {message.role === "user" && onRetryMessage && (
                <button
                  onClick={() => messageActions.startRetry(message.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-yellow-500/10 text-muted-foreground hover:text-yellow-400 transition-all"
                  title="Retry with different model/tone"
                >
                  <span>Retry</span>
                </button>
              )}

              {/* Answer as AI - For user messages */}
              {message.role === "user" && onAnswerAsModel && (
                <button
                  onClick={() => messageActions.startAnswer(message.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-purple-500/10 text-muted-foreground hover:text-purple-400 transition-all"
                  title="Generate AI response"
                >
                  <span>Answer as AI</span>
                </button>
              )}

              {/* Share/Permalink */}
              <button
                onClick={() => {
                  const element = document.getElementById(
                    `thread-msg-${message.id}`,
                  );
                  element?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  navigator.clipboard.writeText(
                    `${window.location.href}#thread-msg-${message.id}`,
                  );
                }}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-all"
                title="Copy permalink"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </button>

              {/* Delete */}
              {onDeleteMessage && (
                <button
                  onClick={() => onDeleteMessage(message.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
                  title="Delete this message"
                >
                  <span>Delete</span>
                </button>
              )}

              {/* Show parent (if not root) */}
              {message.parentId && (
                <button
                  onClick={() => {
                    const element = document.getElementById(
                      `thread-msg-${message.parentId}`,
                    );
                    element?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-all"
                >
                  <CornerDownRight className="h-3.5 w-3.5" />
                  <span>Parent</span>
                </button>
              )}

              {/* Reply count badge */}
              {hasReplies && (
                <div className="ml-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold">
                  {replies.length} {replies.length === 1 ? "reply" : "replies"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nested replies */}
        {hasReplies &&
          !isCollapsed &&
          (depth < maxDepth || showDeepReplies) && (
            <div className="mt-2 space-y-2">
              {replies.map((reply) => (
                <ThreadedMessage
                  key={reply.id}
                  message={reply}
                  replies={getDirectReplies(allMessages, reply.id)}
                  allMessages={allMessages}
                  depth={depth + 1}
                  selectedModel={selectedModel}
                  selectedTone={selectedTone}
                  onEditMessage={onEditMessage}
                  onDeleteMessage={onDeleteMessage}
                  onBranchMessage={onBranchMessage}
                  onRetryMessage={onRetryMessage}
                  onAnswerAsModel={onAnswerAsModel}
                  onModelChange={onModelChange}
                  onToneChange={onToneChange}
                  maxDepth={maxDepth}
                />
              ))}
            </div>
          )}

        {/* "Continue thread" button for deeply nested conversations */}
        {hasReplies &&
          !isCollapsed &&
          depth >= maxDepth &&
          !showDeepReplies && (
            <button
              onClick={() => setShowDeepReplies(true)}
              className="mt-3 text-sm text-blue-500 hover:text-blue-600 cursor-pointer hover:underline transition-all flex items-center gap-1"
            >
              <CornerDownRight className="h-3.5 w-3.5" />
              Continue thread ({replies.length} more{" "}
              {replies.length === 1 ? "reply" : "replies"})
            </button>
          )}
      </div>

      {/* User Profile Hover Card */}
      {hoveredUserId && userCardPosition && (
        <UserProfileCard
          userId={hoveredUserId}
          userName={message.author?.name || "User"}
          messages={allMessages}
          position={userCardPosition}
        />
      )}
    </div>
  );
}
