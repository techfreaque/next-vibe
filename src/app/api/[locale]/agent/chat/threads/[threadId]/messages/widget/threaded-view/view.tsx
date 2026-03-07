"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { CornerDownRight } from "next-vibe-ui/ui/icons/CornerDownRight";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import React, { useCallback, useState } from "react";

import { ErrorBoundary } from "@/app/[locale]/_components/error-boundary";
import { LAYOUT } from "@/app/[locale]/chat/lib/config/constants";
import { chatAnimations } from "@/app/[locale]/chat/lib/design-tokens";
import { getVoteStatus } from "@/app/[locale]/chat/lib/utils/message-votes";
import { getDirectReplies } from "@/app/[locale]/chat/lib/utils/thread-builder";
import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { useChatNavigationStore } from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import { processMessageGroupForTTS } from "@/app/api/[locale]/agent/text-to-speech/content-processing";
import type { TtsVoiceValue } from "@/app/api/[locale]/agent/text-to-speech/enum";
import { useTTSAudio } from "@/app/api/[locale]/agent/text-to-speech/hooks";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTouchDevice } from "@/hooks/use-touch-device";
import type { CountryLanguage } from "@/i18n/core/config";

import { useCharacter } from "../../../../../characters/[id]/hooks";
import { loadMessageAttachments } from "../../hooks/load-message-attachments";
import { useStreamingMessagesStore } from "../../hooks/streaming-messages-store";
import type { CollapseStateStore } from "../../hooks/use-collapse-state";
import { useMessageEditorStore } from "../../hooks/use-message-editor-store";
import { scopedTranslation } from "../../i18n";
import { useMessageGroupName } from "../embedded-context";
import { MessageEditor } from "../message-editor";
import type { groupMessagesBySequence } from "../message-grouping";
import { ModelCharacterSelectorModal } from "../model-character-selector-modal";
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
  collapseState?: CollapseStateStore;
  currentUserId?: string;
  /** Message operations — passed from parent (no context dependency) */
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
  onVoteMessage?: (messageId: string, vote: 1 | -1 | 0) => Promise<void>;
  onDeleteMessage: (messageId: string) => void;
  user: JwtPayloadType;
  ttsAutoplay: boolean;
  deductCredits: (amount: number, feature: string) => void;
  ttsVoice: typeof TtsVoiceValue;
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
  onBranchMessage,
  onRetryMessage,
  onAnswerAsModel,
  onVoteMessage,
  onDeleteMessage,
  user,
  ttsAutoplay,
  deductCredits,
  ttsVoice,
}: ThreadedMessageProps): JSX.Element {
  // Navigation state from Zustand store
  const rootFolderId = useChatNavigationStore((s) => s.currentRootFolderId);

  const { t } = scopedTranslation.scopedT(locale);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDeepReplies, setShowDeepReplies] = useState(false);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
  const [userCardPosition, setUserCardPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Editor state from Zustand store (shared across all view modes)
  const editingMessageId = useMessageEditorStore((s) => s.editingMessageId);
  const retryingMessageId = useMessageEditorStore((s) => s.retryingMessageId);
  const answeringMessageId = useMessageEditorStore((s) => s.answeringMessageId);
  const answerContent = useMessageEditorStore((s) => s.answerContent);
  const editorAttachments = useMessageEditorStore((s) => s.editorAttachments);
  const cancelAction = useMessageEditorStore((s) => s.cancelAction);
  const setAnswerContent = useMessageEditorStore((s) => s.setAnswerContent);
  const setLoadingRetryAttachments = useMessageEditorStore(
    (s) => s.setLoadingRetryAttachments,
  );
  const setEditorAttachments = useMessageEditorStore(
    (s) => s.setEditorAttachments,
  );
  const setRetrying = useMessageEditorStore((s) => s.setRetrying);
  const clearEditing = useMessageEditorStore((s) => s.clearEditing);
  const clearRetrying = useMessageEditorStore((s) => s.clearRetrying);
  const clearAnswering = useMessageEditorStore((s) => s.clearAnswering);

  // Async startRetry — loads attachments then sets retrying state
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
        clearEditing();
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        logger.error(
          "widget.messages.actions.handleBranchEdit.error",
          errorObj,
        );
      }
    },
    [logger, editorAttachments, clearEditing],
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
        clearRetrying();
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));
        logger.error(
          "widget.messages.actions.handleConfirmRetry.error",
          errorObj,
        );
      }
    },
    [logger, editorAttachments, clearRetrying],
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

  // Detect touch device for proper action visibility
  const isTouch = useTouchDevice();
  const { group: messageGroupClass } = useMessageGroupName();

  // Check if this message is currently streaming
  const streamingMessage = useStreamingMessagesStore(
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
    messageId: message.id,
    text: ttsText,
    enabled: message.role === "assistant" && ttsAutoplay,
    isStreaming: isMessageStreaming,
    locale,
    user,
    logger,
    deductCredits,
    voice: ttsVoice,
  });

  const hasReplies = replies.length > 0;
  const isEditing = editingMessageId === message.id;
  const isRetrying = retryingMessageId === message.id;
  const isAnswering = answeringMessageId === message.id;

  // Get vote status
  const { userVote, voteScore } = getVoteStatus(message);

  const characterHook = useCharacter(
    message.character || undefined,
    user,
    logger,
  );
  const characterName = characterHook.read?.data?.name ?? null;

  // Minimal fixed indent - just THREAD_INDENT for any nested level (no increase with depth)
  const indent = depth > 0 ? LAYOUT.THREAD_INDENT * 2 : 0;

  // Stable callback: hover user ID
  const handleUserIdHover = useCallback(
    (userId: string | null, position: { x: number; y: number } | null) => {
      setHoveredUserId(userId);
      setUserCardPosition(position);
    },
    [],
  );

  // Stable callback: start retry wrapper (sync → async)
  const handleStartRetry = useCallback(
    (msg: ChatMessage): void => {
      void startRetry(msg);
    },
    [startRetry],
  );

  // Stable style objects for indent
  const connectorStyle = React.useMemo(
    () => ({
      marginLeft: `${indent - LAYOUT.THREAD_LINE_MARGIN_OFFSET}px`,
      width: `${LAYOUT.THREAD_LINE_WIDTH}px`,
    }),
    [indent],
  );

  const containerPaddingStyle = React.useMemo(
    () => ({ paddingLeft: depth > 0 ? `${indent}px` : "0" }),
    [depth, indent],
  );

  const collapseButtonStyle = React.useMemo(
    () => ({
      left: depth > 0 ? `${indent - 26}px` : "-26px",
      position: "absolute" as const,
      top: "1rem",
    }),
    [depth, indent],
  );

  return (
    <Div className={cn(chatAnimations.slideIn, "relative")}>
      {/* Thread connector line - vertical line on the left */}
      {depth > 0 && (
        <Div style={connectorStyle}>
          <Div className="absolute left-0 top-0 bottom-0 bg-linear-to-b from-blue-500/30 via-blue-500/20 to-transparent" />
        </Div>
      )}

      {/* Message container */}
      <Div style={containerPaddingStyle}>
        <Div className={cn("relative group/thread-item", depth > 0 && "pl-4")}>
          {/* Collapse/Expand button for messages with replies */}
          {hasReplies && (
            <Div style={collapseButtonStyle}>
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
                      ? t("widget.threadedView.expandReplies")
                      : t("widget.threadedView.collapseReplies")
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
            className={cn(messageGroupClass, "relative")}
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
                    handleBranchEdit(id, content, onBranchMessage)
                  }
                  onCancel={cancelAction}
                  locale={locale}
                  logger={logger}
                  user={user}
                />
              </Div>
            ) : isRetrying ? (
              <Div className="flex justify-end">
                <ModelCharacterSelectorModal
                  titleKey="widget.threadedView.retryModal.title"
                  descriptionKey="widget.threadedView.retryModal.description"
                  onConfirm={(): Promise<void> =>
                    handleConfirmRetry(message.id, onRetryMessage)
                  }
                  onCancel={cancelAction}
                  confirmLabelKey="widget.threadedView.retryModal.confirmLabel"
                  locale={locale}
                  logger={logger}
                  user={user}
                />
              </Div>
            ) : (
              <ThreadedMessageContent
                message={message}
                messageGroup={messageGroup}
                depth={depth}
                locale={locale}
                user={user}
                collapseState={collapseState}
                currentUserId={currentUserId}
                onUserIdHover={handleUserIdHover}
                logger={logger}
                characterName={characterName}
                rootFolderId={rootFolderId}
              />
            )}

            {/* Reddit-style action bar - All features */}
            <ThreadedMessageActions
              message={message}
              locale={locale}
              isTouch={isTouch}
              onStartRetry={handleStartRetry}
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
              <ModelCharacterSelectorModal
                titleKey="widget.threadedView.answerModal.title"
                descriptionKey="widget.threadedView.answerModal.description"
                showInput={true}
                inputValue={answerContent}
                onInputChange={setAnswerContent}
                inputPlaceholderKey="widget.threadedView.answerModal.inputPlaceholder"
                onConfirm={(): Promise<void> =>
                  handleConfirmAnswer(message.id, onAnswerAsModel)
                }
                onCancel={cancelAction}
                confirmLabelKey="widget.threadedView.answerModal.confirmLabel"
                locale={locale}
                logger={logger}
                user={user}
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
                      onBranchMessage={onBranchMessage}
                      onRetryMessage={onRetryMessage}
                      onAnswerAsModel={onAnswerAsModel}
                      onVoteMessage={onVoteMessage}
                      onDeleteMessage={onDeleteMessage}
                      user={user}
                      ttsAutoplay={ttsAutoplay}
                      deductCredits={deductCredits}
                      ttsVoice={ttsVoice}
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
                {t("widget.threadedView.continueThread", {
                  count: replies.length,
                  replyText:
                    replies.length === 1
                      ? t("widget.threadedView.reply")
                      : t("widget.threadedView.replies"),
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
            rootFolderId === "public" || rootFolderId === "shared"
              ? (message.authorName ??
                (message.authorId
                  ? message.authorId.slice(0, 8)
                  : t("widget.threadedView.userFallback")))
              : t("widget.threadedView.youLabel")
          }
          messages={allMessages}
          position={userCardPosition}
          locale={locale}
        />
      )}
    </Div>
  );
}
