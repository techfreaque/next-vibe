"use client";

import { cn } from "next-vibe/shared/utils";
import { Div } from "next-vibe-ui/ui/div";
import { Markdown } from "next-vibe-ui/ui/markdown";
import { Span } from "next-vibe-ui/ui/span";
import {
  ArrowBigDown,
  ArrowBigUp,
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  Loader2,
  MessageSquare,
  Share2,
  Square,
  Volume2,
} from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React, { useState } from "react";

import { Logo } from "@/app/[locale]/_components/logo";
import { useAIStreamStore } from "@/app/api/[locale]/v1/core/agent/ai-stream/hooks/store";
import { getModelById } from "@/app/api/[locale]/v1/core/agent/chat/model-access/models";
import { getPersonaName } from "@/app/api/[locale]/v1/core/agent/chat/personas/config";
import { useTTSAudio } from "@/app/api/[locale]/v1/core/agent/text-to-speech/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { useTouchDevice } from "../../hooks/use-touch-device";
import { LAYOUT } from "../../lib/config/constants";
import { chatAnimations } from "../../lib/design-tokens";
import { getVoteStatus } from "../../lib/utils/message-votes";
import { getDirectReplies } from "../../lib/utils/thread-builder";
import type { ChatMessage, ModelId } from "../../types";
import { ErrorMessageBubble } from "./error-message-bubble";
import { MessageEditor } from "./message-editor";

import { ModelPersonaSelectorModal } from "./model-persona-selector-modal";
import { ToolDisplay } from "./tool-display";
import type { useCollapseState } from "./use-collapse-state";
import { useMessageActions } from "./use-message-actions";
import type { groupMessagesBySequence } from "./message-grouping";
import { UserProfileCard } from "./user-profile-card";

interface ThreadedMessageProps {
  message: ChatMessage;
  messageGroup?: ReturnType<typeof groupMessagesBySequence>[0];
  replies: ChatMessage[];
  allMessages: ChatMessage[];
  messageToGroupMap: Map<string, ReturnType<typeof groupMessagesBySequence>[0]>;
  depth: number;
  selectedModel: ModelId;
  selectedPersona: string;
  ttsAutoplay: boolean;
  locale: CountryLanguage;
  logger: EndpointLogger;
  onDeleteMessage: (messageId: string) => void;
  onBranchMessage?: (messageId: string, newContent: string) => Promise<void>;
  onRetryMessage?: (messageId: string) => Promise<void>;
  onAnswerAsModel?: (messageId: string, content: string) => Promise<void>;
  onVoteMessage?: (messageId: string, vote: 1 | -1 | 0) => void;
  onModelChange?: (model: ModelId) => void;
  onPersonaChange?: (persona: string) => void;
  maxDepth?: number;
  rootFolderId?: string;
  /** Collapse state management callbacks */
  collapseState?: ReturnType<typeof useCollapseState>;
}

export function ThreadedMessage({
  message,
  messageGroup,
  replies,
  allMessages,
  messageToGroupMap,
  depth,
  selectedModel,
  selectedPersona,
  ttsAutoplay,
  locale,
  logger,
  onDeleteMessage,
  collapseState,
  onBranchMessage,
  onRetryMessage,
  onAnswerAsModel,
  onVoteMessage,
  onModelChange,
  onPersonaChange,
  maxDepth = LAYOUT.MAX_THREAD_DEPTH,
  rootFolderId = "general",
}: ThreadedMessageProps): JSX.Element {
  const { t } = simpleT(locale);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDeepReplies, setShowDeepReplies] = useState(false);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [userCardPosition, setUserCardPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Use custom hook for message action state management
  const messageActions = useMessageActions(logger);

  // Detect touch device for proper action visibility
  const isTouch = useTouchDevice();

  // Get all messages in the sequence (primary + continuations)
  const allMessagesInSequence = messageGroup
    ? [messageGroup.primary, ...messageGroup.continuations].toSorted(
        (a, b) => (a.sequenceIndex ?? 0) - (b.sequenceIndex ?? 0),
      )
    : [message];

  // Check if this message is currently streaming
  const streamingMessage = useAIStreamStore(
    (state) => state.streamingMessages[message.id],
  );
  const isMessageStreaming = streamingMessage?.isStreaming ?? false;

  // TTS support for assistant messages
  const {
    isLoading: isTTSLoading,
    isPlaying,
    playAudio,
    stopAudio,
  } = useTTSAudio({
    text: message.content,
    enabled: message.role === "assistant" && ttsAutoplay,
    isStreaming: isMessageStreaming,
    locale,
    logger,
  });

  const hasReplies = replies.length > 0;
  const isEditing = messageActions.isEditing(message.id);
  const isRetrying = messageActions.isRetrying(message.id);
  const isAnswering = messageActions.isAnswering(message.id);

  // Get vote status
  const { userVote, voteScore } = getVoteStatus(message);

  // Minimal fixed indent - just THREAD_INDENT for any nested level (no increase with depth)
  const indent = depth > 0 ? LAYOUT.THREAD_INDENT * 2 : 0;

  return (
    <Div className={cn(chatAnimations.slideIn, "relative")}>
      {/* Thread connector line - vertical line on the left */}
      {depth > 0 && (
        <Div
          className="absolute left-0 top-0 bottom-0 bg-linear-to-b from-blue-500/30 via-blue-500/20 to-transparent"
          style={{
            marginLeft: `${indent - LAYOUT.THREAD_LINE_MARGIN_OFFSET}px`,
            width: `${LAYOUT.THREAD_LINE_WIDTH}px`,
          }}
        />
      )}

      {/* Message container */}
      <Div
        className={cn("relative group/thread-item", depth > 0 && "pl-4")}
        style={{ paddingLeft: depth > 0 ? `${indent}px` : "0" }}
      >
        {/* Collapse/Expand button for messages with replies */}
        {hasReplies && (
          <button
            onClick={(): void => setIsCollapsed(!isCollapsed)}
            className={cn(
              "absolute top-4 z-10",
              "h-5 w-5 rounded",
              "bg-card backdrop-blur-sm border border-border/60",
              "flex items-center justify-center",
              "hover:bg-blue-500/10 hover:border-blue-500/40 transition-all",
              "text-muted-foreground hover:text-blue-400",
              "shadow-sm",
            )}
            style={{ left: depth > 0 ? `${indent - 26}px` : "-26px" }}
            title={
              isCollapsed
                ? t("app.chat.threadedView.expandReplies")
                : t("app.chat.threadedView.collapseReplies")
            }
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        )}

        {/* Message content */}
        <Div id={`thread-msg-${message.id}`} className="group/message relative">
          {/* Collapsed state indicator */}
          {isCollapsed && hasReplies && (
            <Div className="absolute -bottom-2 left-0 right-0 h-8 flex items-center justify-center">
              <Div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-medium flex items-center gap-2">
                <ChevronRight className="h-3 w-3" />
                <Span>
                  {replies.length} hidden{" "}
                  {replies.length === 1 ? "reply" : "replies"}
                </Span>
              </Div>
            </Div>
          )}

          {isEditing ? (
            <Div
              className={cn(message.role === "user" ? "flex justify-end" : "")}
            >
              <MessageEditor
                message={message}
                selectedModel={selectedModel}
                selectedPersona={selectedPersona}
                onBranch={(id, content) =>
                  messageActions.handleBranchEdit(id, content, onBranchMessage)
                }
                onCancel={messageActions.cancelAction}
                onModelChange={onModelChange}
                onPersonaChange={onPersonaChange}
                locale={locale}
                logger={logger}
              />
            </Div>
          ) : isRetrying ? (
            <Div className="flex justify-end">
              <ModelPersonaSelectorModal
                titleKey="app.chat.threadedView.retryModal.title"
                descriptionKey="app.chat.threadedView.retryModal.description"
                selectedModel={selectedModel}
                selectedPersona={selectedPersona}
                onModelChange={
                  onModelChange ||
                  ((model: ModelId): void => {
                    logger.debug(
                      "ThreadedMessage",
                      "Model selection changed (no handler)",
                      { model },
                    );
                  })
                }
                onPersonaChange={
                  onPersonaChange ||
                  ((persona: string): void => {
                    logger.debug(
                      "ThreadedMessage",
                      "Persona selection changed (no handler)",
                      { persona },
                    );
                  })
                }
                onConfirm={(): Promise<void> =>
                  messageActions.handleConfirmRetry(message.id, onRetryMessage)
                }
                onCancel={messageActions.cancelAction}
                confirmLabelKey="app.chat.threadedView.retryModal.confirmLabel"
                locale={locale}
                logger={logger}
              />
            </Div>
          ) : (
            <>
              {/* Custom Reddit-style message rendering */}
              <Div
                className={cn(
                  "group/message p-4 rounded-lg",
                  "bg-muted backdrop-blur-sm",
                  "border border-border/30",
                  "hover:border-border/50 transition-all",
                  "relative",
                )}
              >
                {/* Logo watermark for first message */}
                {depth === 0 && !message.parentId && (
                  <Div className="absolute top-3 right-3 pointer-events-none bg-card backdrop-blur-xl rounded-md p-1.5 shadow-sm border border-border/10 opacity-70">
                    <Logo locale={locale} pathName="/" size="h-6" />
                  </Div>
                )}

                {/* Message header */}
                <Div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground flex-wrap">
                  <button
                    className={cn(
                      "font-semibold hover:underline cursor-pointer flex items-center gap-1.5",
                      message.role === "user"
                        ? "text-green-400"
                        : "text-blue-400",
                    )}
                    onMouseEnter={(e): void => {
                      if (message.authorId) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredUserId(message.authorId);
                        setUserCardPosition({
                          x: rect.left + rect.width / 2,
                          y: rect.bottom,
                        });
                      }
                    }}
                    onMouseLeave={(): void => {
                      setHoveredUserId(null);
                      setUserCardPosition(null);
                    }}
                  >
                    {/* Show model icon for AI messages */}
                    {message.role === "assistant" &&
                      message.model &&
                      ((): JSX.Element | null => {
                        const modelData = getModelById(message.model);
                        const ModelIcon = modelData.icon;
                        return typeof ModelIcon === "string" ? (
                          <Span className="text-base leading-none">
                            {ModelIcon}
                          </Span>
                        ) : (
                          <ModelIcon className="h-3 w-3" />
                        );
                      })()}
                    {message.role === "user"
                      ? rootFolderId === "general" ||
                        rootFolderId === "shared" ||
                        rootFolderId === "public"
                        ? t("app.chat.threadedView.youLabel")
                        : t("app.chat.threadedView.userFallback")
                      : message.role === "assistant" && message.model
                        ? getModelById(message.model).name
                        : t("app.chat.threadedView.assistantFallback")}
                  </button>

                  {/* Persona - only for AI messages */}
                  {message.role === "assistant" && message.persona && (
                    <>
                      <Span>•</Span>
                      <Span className="text-muted-foreground/80">
                        {getPersonaName(message.persona)}
                      </Span>
                    </>
                  )}

                  <Span>•</Span>
                  <Span>{message.createdAt.toLocaleString()}</Span>
                </Div>

                {/* Message content - render all messages in sequence */}
                <Div className="text-sm">
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
                        {msg.role === "assistant" ? (
                          <Div
                            className={cn(
                              "prose prose-sm dark:prose-invert max-w-none",
                              "prose-p:my-2 prose-p:leading-relaxed",
                              "prose-code:text-blue-400 prose-code:bg-blue-950/40 prose-code:px-1 prose-code:rounded",
                              "prose-pre:bg-black/60 prose-pre:border prose-pre:border-border/40 prose-pre:rounded-md",
                              "prose-headings:text-foreground prose-headings:font-bold",
                              "prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline",
                              msgIndex > 0 && "mt-3",
                            )}
                          >
                            {/* NEW ARCHITECTURE: Tool calls are separate TOOL messages now */}
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
                            {msg.content}
                          </Div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </Div>
              </Div>

              {message.role === "error" && (
                <ErrorMessageBubble message={message} />
              )}
            </>
          )}

          {/* Reddit-style action bar - All features */}
          {!isEditing && !isRetrying && !isAnswering && (
            <Div
              className={cn(
                "flex items-center gap-2 mt-3 text-xs font-medium flex-wrap transition-opacity",
                // Touch devices: always visible but slightly transparent
                // Pointer devices: hidden until hover
                isTouch
                  ? "opacity-70 active:opacity-100"
                  : "opacity-0 group-hover/message:opacity-100 focus-within:opacity-100",
              )}
            >
              {/* Voting buttons */}
              {onVoteMessage && (
                <Div className="flex items-center gap-0.5">
                  <button
                    onClick={() =>
                      onVoteMessage(message.id, userVote === "up" ? 0 : 1)
                    }
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-500/10 transition-all",
                      userVote === "up"
                        ? "text-blue-400"
                        : "text-muted-foreground hover:text-blue-400",
                    )}
                    title={t("app.chat.threadedView.actions.upvote")}
                  >
                    <ArrowBigUp
                      className={cn(
                        "h-4 w-4",
                        userVote === "up" && "fill-current",
                      )}
                    />
                  </button>
                  {voteScore !== 0 && (
                    <Span
                      className={cn(
                        "text-xs font-medium min-w-6 text-center",
                        voteScore > 0 && "text-blue-400",
                        voteScore < 0 && "text-red-400",
                      )}
                    >
                      {voteScore > 0 ? `+${voteScore}` : voteScore}
                    </Span>
                  )}
                  <button
                    onClick={() =>
                      onVoteMessage(message.id, userVote === "down" ? 0 : -1)
                    }
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded hover:bg-red-500/10 transition-all",
                      userVote === "down"
                        ? "text-red-400"
                        : "text-muted-foreground hover:text-red-400",
                    )}
                    title={t("app.chat.threadedView.actions.downvote")}
                  >
                    <ArrowBigDown
                      className={cn(
                        "h-4 w-4",
                        userVote === "down" && "fill-current",
                      )}
                    />
                  </button>
                </Div>
              )}

              {/* TTS Play/Stop button - For assistant messages */}
              {message.role === "assistant" && (
                <button
                  onClick={isPlaying ? stopAudio : (): void => void playAudio()}
                  disabled={isTTSLoading}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-all",
                    isTTSLoading && "opacity-50 cursor-not-allowed",
                  )}
                  title={
                    isTTSLoading
                      ? t("app.chat.threadedView.actions.loadingAudio")
                      : isPlaying
                        ? t("app.chat.threadedView.actions.stopAudio")
                        : t("app.chat.threadedView.actions.playAudio")
                  }
                >
                  {isTTSLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : isPlaying ? (
                    <Square className="h-3.5 w-3.5" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5" />
                  )}
                  <Span>
                    {isPlaying
                      ? t("app.chat.threadedView.actions.stop")
                      : t("app.chat.threadedView.actions.play")}
                  </Span>
                </button>
              )}

              {/* Reply button - Creates a branch from this message */}
              {onBranchMessage && (
                <button
                  onClick={(): void => messageActions.startEdit(message.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-all"
                  title={t("app.chat.threadedView.actions.replyToMessage")}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <Span>{t("app.chat.threadedView.actions.reply")}</Span>
                </button>
              )}

              {/* Edit - For user messages */}
              {message.role === "user" && onBranchMessage && (
                <button
                  onClick={(): void => messageActions.startEdit(message.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-green-500/10 text-muted-foreground hover:text-green-400 transition-all"
                  title={t("app.chat.threadedView.actions.editMessage")}
                >
                  <Span>{t("app.chat.threadedView.actions.edit")}</Span>
                </button>
              )}

              {/* Retry - For user messages */}
              {message.role === "user" && onRetryMessage && (
                <button
                  onClick={(): void => messageActions.startRetry(message.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-yellow-500/10 text-muted-foreground hover:text-yellow-400 transition-all"
                  title={t("app.chat.threadedView.actions.retryWithDifferent")}
                >
                  <Span>{t("app.chat.threadedView.actions.retry")}</Span>
                </button>
              )}

              {/* Answer as AI - For both user and assistant messages */}
              {onAnswerAsModel && (
                <button
                  onClick={(): void => messageActions.startAnswer(message.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-purple-500/10 text-muted-foreground hover:text-purple-400 transition-all"
                  title={
                    message.role === "assistant"
                      ? t("app.chat.threadedView.actions.respondToAI")
                      : t("app.chat.threadedView.actions.generateAIResponse")
                  }
                >
                  <Span>{t("app.chat.threadedView.actions.answerAsAI")}</Span>
                </button>
              )}

              {/* Share/Permalink */}
              <button
                onClick={(): void => {
                  const element = document.getElementById(
                    `thread-msg-${message.id}`,
                  );
                  element?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  void navigator.clipboard.writeText(
                    `${window.location.href}#thread-msg-${message.id}`,
                  );
                }}
                className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-all"
                title={t("app.chat.threadedView.actions.copyPermalink")}
              >
                <Share2 className="h-3.5 w-3.5" />
                <Span>{t("app.chat.threadedView.actions.share")}</Span>
              </button>

              {/* Delete */}
              {onDeleteMessage && (
                <button
                  onClick={(): void => onDeleteMessage(message.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
                  title={t("app.chat.threadedView.actions.deleteMessage")}
                >
                  <Span>{t("app.chat.threadedView.actions.delete")}</Span>
                </button>
              )}

              {/* Show parent (if not root) */}
              {message.parentId && (
                <button
                  onClick={(): void => {
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
                  <Span>{t("app.chat.threadedView.actions.parent")}</Span>
                </button>
              )}

              {/* Reply count badge */}
              {hasReplies && (
                <Div className="ml-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold">
                  {replies.length} {replies.length === 1 ? "reply" : "replies"}
                </Div>
              )}
            </Div>
          )}
        </Div>

        {/* Show Answer-as-AI dialog below the message */}
        {isAnswering && (
          <Div className="mt-3">
            <ModelPersonaSelectorModal
              titleKey="app.chat.threadedView.answerModal.title"
              descriptionKey="app.chat.threadedView.answerModal.description"
              selectedModel={selectedModel}
              selectedPersona={selectedPersona}
              onModelChange={
                onModelChange ||
                ((model: ModelId): void => {
                  logger.debug(
                    "ThreadedMessage",
                    "Model selection changed (no handler)",
                    { model },
                  );
                })
              }
              onPersonaChange={
                onPersonaChange ||
                ((persona: string): void => {
                  logger.debug(
                    "ThreadedMessage",
                    "Persona selection changed (no handler)",
                    { persona },
                  );
                })
              }
              showInput={true}
              inputValue={messageActions.answerContent}
              onInputChange={messageActions.setAnswerContent}
              inputPlaceholderKey="app.chat.threadedView.answerModal.inputPlaceholder"
              onConfirm={(): Promise<void> =>
                messageActions.handleConfirmAnswer(message.id, onAnswerAsModel)
              }
              onCancel={messageActions.cancelAction}
              confirmLabelKey="app.chat.threadedView.answerModal.confirmLabel"
              locale={locale}
              logger={logger}
            />
          </Div>
        )}

        {/* Nested replies */}
        {hasReplies &&
          !isCollapsed &&
          (depth < maxDepth || showDeepReplies) && (
            <Div className="mt-2 space-y-2">
              {replies.map((reply) => (
                <ThreadedMessage
                  key={reply.id}
                  message={reply}
                  messageGroup={messageToGroupMap.get(reply.id)}
                  replies={getDirectReplies(allMessages, reply.id)}
                  allMessages={allMessages}
                  messageToGroupMap={messageToGroupMap}
                  depth={depth + 1}
                  selectedModel={selectedModel}
                  selectedPersona={selectedPersona}
                  ttsAutoplay={ttsAutoplay}
                  locale={locale}
                  logger={logger}
                  onDeleteMessage={onDeleteMessage}
                  collapseState={collapseState}
                  onBranchMessage={onBranchMessage}
                  onRetryMessage={onRetryMessage}
                  onAnswerAsModel={onAnswerAsModel}
                  onVoteMessage={onVoteMessage}
                  onModelChange={onModelChange}
                  onPersonaChange={onPersonaChange}
                  maxDepth={maxDepth}
                  rootFolderId={rootFolderId}
                />
              ))}
            </Div>
          )}

        {/* "Continue thread" button for deeply nested conversations */}
        {hasReplies &&
          !isCollapsed &&
          depth >= maxDepth &&
          !showDeepReplies && (
            <button
              onClick={(): void => setShowDeepReplies(true)}
              className="mt-3 text-sm text-blue-500 hover:text-blue-600 cursor-pointer hover:underline transition-all flex items-center gap-1"
            >
              <CornerDownRight className="h-3.5 w-3.5" />
              {t("app.chat.threadedView.continueThread", {
                count: replies.length,
                replyText:
                  replies.length === 1
                    ? t("app.chat.threadedView.reply")
                    : t("app.chat.threadedView.replies"),
              })}
            </button>
          )}
      </Div>

      {/* User Profile Hover Card */}
      {hoveredUserId && userCardPosition && (
        <UserProfileCard
          userId={hoveredUserId}
          userName={
            message.authorName || t("app.chat.threadedView.userFallback")
          }
          messages={allMessages}
          position={userCardPosition}
          locale={locale}
        />
      )}
    </Div>
  );
}
