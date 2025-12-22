"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  ChevronDown,
  ChevronRight,
  CornerDownRight,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import React, { useState } from "react";

import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";
import { LAYOUT } from "@/app/[locale]/chat/lib/config/constants";
import { chatAnimations } from "@/app/[locale]/chat/lib/design-tokens";
import { getVoteStatus } from "@/app/[locale]/chat/lib/utils/message-votes";
import { getDirectReplies } from "@/app/[locale]/chat/lib/utils/thread-builder";
import { useAIStreamStore } from "@/app/api/[locale]/agent/ai-stream/hooks/store";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { useChatContext } from "@/app/api/[locale]/agent/chat/hooks/context";
import type { ModelId } from "@/app/api/[locale]/agent/chat/model-access/models";
import { processMessageGroupForTTS } from "@/app/api/[locale]/agent/text-to-speech/content-processing";
import { useTTSAudio } from "@/app/api/[locale]/agent/text-to-speech/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useTouchDevice } from "@/hooks/use-touch-device";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { useCollapseState } from "../hooks/use-collapse-state";
import { useMessageActions } from "../hooks/use-message-actions";
import { MessageEditor } from "../message-editor";
import type { groupMessagesBySequence } from "../message-grouping";
import { ModelPersonaSelectorModal } from "../model-character-selector-modal";
import { UserProfileCard } from "../user-profile-card";
import { ThreadedMessageActions } from "./actions";
import { ThreadedMessageContent } from "./content";

interface ThreadedMessageProps {
  message: ChatMessage;
  messageGroup?: ReturnType<typeof groupMessagesBySequence>[0];
  replies: ChatMessage[];
  allMessages: ChatMessage[];
  messageToGroupMap: Map<string, ReturnType<typeof groupMessagesBySequence>[0]>;
  depth: number;
  locale: CountryLanguage;
  logger: EndpointLogger;
  maxDepth?: number;
  /** Collapse state management callbacks */
  collapseState?: ReturnType<typeof useCollapseState>;
  currentUserId?: string;
}

export function ThreadedMessage({
  message,
  messageGroup,
  replies,
  allMessages,
  messageToGroupMap,
  depth,
  locale,
  logger,
  collapseState,
  maxDepth = LAYOUT.MAX_THREAD_DEPTH,
  currentUserId,
}: ThreadedMessageProps): JSX.Element {
  // Get callbacks and state from context
  const {
    ttsAutoplay,
    deductCredits,
    handleDeleteMessage: onDeleteMessage,
    branchMessage: onBranchMessage,
    retryMessage: onRetryMessage,
    answerAsAI: onAnswerAsModel,
    voteMessage: onVoteMessage,
    handleModelChange: onModelChange,
    setSelectedCharacter: onCharacterChange,
    selectedCharacter,
    characters,
  } = useChatContext();

  // Get voice from current character
  const currentCharacter = characters[selectedCharacter];
  const characterVoice = currentCharacter?.voice;

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

  // Check if this message is currently streaming
  const streamingMessage = useAIStreamStore(
    (state) => state.streamingMessages[message.id],
  );
  const isMessageStreaming = streamingMessage?.isStreaming ?? false;

  // TTS support for assistant messages
  // Process entire message group (primary + continuations) for sequential playback
  const allMessagesInGroup = React.useMemo(
    () =>
      messageGroup
        ? [messageGroup.primary, ...messageGroup.continuations]
        : [message],
    [messageGroup, message],
  );

  // Process messages for TTS (async operation)
  const [ttsText, setTtsText] = React.useState<string>("");

  React.useEffect(() => {
    void processMessageGroupForTTS(allMessagesInGroup, locale, logger).then(
      setTtsText,
    );
  }, [allMessagesInGroup, locale, logger]);

  const {
    isLoading: isTTSLoading,
    isPlaying,
    playAudio,
    stopAudio,
    cancelLoading,
    currentChunk,
    totalChunks,
  } = useTTSAudio({
    text: ttsText,
    enabled: message.role === "assistant" && ttsAutoplay,
    isStreaming: isMessageStreaming,
    locale,
    logger,
    deductCredits,
    voice: characterVoice,
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
          style={{
            marginLeft: `${indent - LAYOUT.THREAD_LINE_MARGIN_OFFSET}px`,
            width: `${LAYOUT.THREAD_LINE_WIDTH}px`,
          }}
        >
          <Div className="absolute left-0 top-0 bottom-0 bg-linear-to-b from-blue-500/30 via-blue-500/20 to-transparent" />
        </Div>
      )}

      {/* Message container */}
      <Div style={{ paddingLeft: depth > 0 ? `${indent}px` : "0" }}>
        <Div className={cn("relative group/thread-item", depth > 0 && "pl-4")}>
          {/* Collapse/Expand button for messages with replies */}
          {hasReplies && (
            <Div
              style={{
                left: depth > 0 ? `${indent - 26}px` : "-26px",
                position: "absolute" as const,
                top: "1rem",
              }}
            >
              <Div className="z-10">
                <Button
                  variant="ghost"
                  size="unset"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className={cn(
                    "h-5 w-5 rounded",
                    "bg-card backdrop-blur-sm border border-border/60",
                    "flex items-center justify-center",
                    "hover:bg-blue-500/10 hover:border-blue-500/40 transition-all",
                    "text-muted-foreground hover:text-blue-400",
                    "shadow-sm",
                  )}
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
                </Button>
              </Div>
            </Div>
          )}

          {/* Message content */}
          <Div
            id={`thread-msg-${message.id}`}
            className="group/message relative"
          >
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
                className={cn(
                  message.role === "user" ? "flex justify-end" : "",
                )}
              >
                <MessageEditor
                  message={message}
                  onBranch={(id, content) =>
                    messageActions.handleBranchEdit(
                      id,
                      content,
                      onBranchMessage,
                    )
                  }
                  onCancel={messageActions.cancelAction}
                  onModelChange={onModelChange}
                  onCharacterChange={onCharacterChange}
                  locale={locale}
                  logger={logger}
                />
              </Div>
            ) : isRetrying ? (
              <Div className="flex justify-end">
                <ModelPersonaSelectorModal
                  titleKey="app.chat.threadedView.retryModal.title"
                  descriptionKey="app.chat.threadedView.retryModal.description"
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
                  onCharacterChange={
                    onCharacterChange ||
                    ((character: string): void => {
                      logger.debug(
                        "ThreadedMessage",
                        "Character selection changed (no handler)",
                        { character },
                      );
                    })
                  }
                  onConfirm={(): Promise<void> =>
                    messageActions.handleConfirmRetry(
                      message.id,
                      onRetryMessage,
                    )
                  }
                  onCancel={messageActions.cancelAction}
                  confirmLabelKey="app.chat.threadedView.retryModal.confirmLabel"
                  locale={locale}
                  logger={logger}
                />
              </Div>
            ) : (
              <ThreadedMessageContent
                message={message}
                messageGroup={messageGroup}
                depth={depth}
                locale={locale}
                collapseState={collapseState}
                currentUserId={currentUserId}
                onUserIdHover={(userId, position) => {
                  setHoveredUserId(userId);
                  setUserCardPosition(position);
                }}
              />
            )}

            {/* Reddit-style action bar - All features */}
            <ThreadedMessageActions
              message={message}
              locale={locale}
              messageActions={messageActions}
              isTouch={isTouch}
              isTTSLoading={isTTSLoading}
              isPlaying={isPlaying}
              playAudio={playAudio}
              stopAudio={stopAudio}
              cancelLoading={cancelLoading}
              currentChunk={currentChunk}
              totalChunks={totalChunks}
              ttsText={ttsText}
              userVote={userVote}
              voteScore={voteScore}
              onVoteMessage={onVoteMessage}
              onDeleteMessage={onDeleteMessage}
              replyCount={replies.length}
              hasReplies={hasReplies}
              isEditing={isEditing}
              isRetrying={isRetrying}
              isAnswering={isAnswering}
            />
          </Div>

          {/* Show Answer-as-AI dialog below the message */}
          {isAnswering && (
            <Div className="mt-3">
              <ModelPersonaSelectorModal
                titleKey="app.chat.threadedView.answerModal.title"
                descriptionKey="app.chat.threadedView.answerModal.description"
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
                onCharacterChange={
                  onCharacterChange ||
                  ((character: string): void => {
                    logger.debug(
                      "ThreadedMessage",
                      "Character selection changed (no handler)",
                      { character },
                    );
                  })
                }
                showInput={true}
                inputValue={messageActions.answerContent}
                onInputChange={messageActions.setAnswerContent}
                inputPlaceholderKey="app.chat.threadedView.answerModal.inputPlaceholder"
                onConfirm={(): Promise<void> =>
                  messageActions.handleConfirmAnswer(
                    message.id,
                    onAnswerAsModel,
                  )
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
              <Div className="mt-2 flex flex-col gap-2">
                {replies.map((reply) => (
                  <ErrorBoundary key={reply.id} locale={locale}>
                    <ThreadedMessage
                      message={reply}
                      messageGroup={messageToGroupMap.get(reply.id)}
                      replies={getDirectReplies(allMessages, reply.id)}
                      allMessages={allMessages}
                      messageToGroupMap={messageToGroupMap}
                      depth={depth + 1}
                      locale={locale}
                      logger={logger}
                      collapseState={collapseState}
                      maxDepth={maxDepth}
                      currentUserId={currentUserId}
                    />
                  </ErrorBoundary>
                ))}
              </Div>
            )}

          {/* "Continue thread" button for deeply nested conversations */}
          {hasReplies &&
            !isCollapsed &&
            depth >= maxDepth &&
            !showDeepReplies && (
              <Button
                variant="ghost"
                size="unset"
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
              </Button>
            )}
        </Div>
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
