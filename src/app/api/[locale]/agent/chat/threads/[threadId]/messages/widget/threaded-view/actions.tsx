"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowBigDown } from "next-vibe-ui/ui/icons/ArrowBigDown";
import { ArrowBigUp } from "next-vibe-ui/ui/icons/ArrowBigUp";
import { CornerDownRight } from "next-vibe-ui/ui/icons/CornerDownRight";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Share2 } from "next-vibe-ui/ui/icons/Share2";
import { Square } from "next-vibe-ui/ui/icons/Square";
import { Volume2 } from "next-vibe-ui/ui/icons/Volume2";
import { X } from "next-vibe-ui/ui/icons/X";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import React from "react";

import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import { FEATURE_COSTS } from "@/app/api/[locale]/products/repository-client";
import { useWidgetNavigation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  useChatNavigationStore,
  type ChatNavigationState,
} from "@/app/api/[locale]/agent/chat/hooks/use-chat-navigation-store";
import { useMessageEditorStore } from "../../hooks/use-message-editor-store";
import { scopedTranslation } from "../../i18n";
import { useMessageGroupName } from "../embedded-context";

interface ThreadedMessageActionsProps {
  message: ChatMessage;
  locale: CountryLanguage;
  isTouch: boolean;
  onStartRetry: (message: ChatMessage) => void;
  // TTS props
  isTTSLoading: boolean;
  isPlaying: boolean;
  playAudio: () => void;
  stopAudio: () => void;
  cancelLoading: () => void;
  currentChunk: number;
  totalChunks: number;
  ttsText: string;
  // Vote props
  userVote: "up" | "down" | null;
  voteScore: number;
  onVoteMessage?: (messageId: string, vote: 1 | -1 | 0) => Promise<void>;
  // Reply count
  replyCount: number;
  hasReplies: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  // State flags
  isEditing: boolean;
  isRetrying: boolean;
  isAnswering: boolean;
  isReplying: boolean;
}

export function ThreadedMessageActions({
  message,
  locale,
  isTouch,
  onStartRetry,
  isTTSLoading,
  isPlaying,
  playAudio,
  stopAudio,
  cancelLoading,
  currentChunk,
  totalChunks,
  ttsText,
  userVote,
  voteScore,
  onVoteMessage,
  replyCount,
  hasReplies,
  isCollapsed,
  onToggleCollapse,
  isEditing,
  isRetrying,
  isAnswering,
  isReplying,
}: ThreadedMessageActionsProps): JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  const { groupHover } = useMessageGroupName();
  const { push: navigate } = useWidgetNavigation();
  const rootFolderId = useChatNavigationStore(
    (s: ChatNavigationState) => s.currentRootFolderId,
  );

  // Editor actions from Zustand store
  const startEdit = useMessageEditorStore((s) => s.startEdit);
  const startAnswer = useMessageEditorStore((s) => s.startAnswer);
  const startReply = useMessageEditorStore((s) => s.startReply);

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

  // Calculate TTS credit cost based on text length
  const ttsCreditCost = ttsText.length * FEATURE_COSTS.TTS;

  // When collapsed, only show the reply count badge (always visible, not gated by hover)
  if (isCollapsed && hasReplies) {
    return (
      <Div className="flex items-center mt-3">
        <Button
          variant="ghost"
          size="unset"
          onClick={onToggleCollapse}
          className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all"
          title={t("widget.threadedView.expandReplies")}
        >
          {replyCount}{" "}
          {replyCount === 1
            ? t("widget.threadedView.reply")
            : t("widget.threadedView.replies")}
        </Button>
      </Div>
    );
  }

  // Don't show actions if in edit/retry/answer/reply mode
  if (isEditing || isRetrying || isAnswering || isReplying) {
    return null;
  }

  return (
    <Div
      className={cn(
        "flex items-center gap-2 mt-3 text-xs font-medium flex-wrap transition-opacity",
        // Touch devices: always visible but slightly transparent
        // Pointer devices: hidden until hover
        isTouch
          ? "opacity-70 active:opacity-100"
          : `opacity-0 ${groupHover} focus-within:opacity-100`,
      )}
    >
      {/* Voting buttons */}
      {onVoteMessage && (
        <Div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="unset"
            onClick={() => onVoteMessage(message.id, userVote === "up" ? 0 : 1)}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded hover:bg-primary/10 transition-all",
              userVote === "up"
                ? "text-primary"
                : "text-muted-foreground hover:text-primary",
            )}
            title={t("widget.threadedView.actions.upvote")}
          >
            <ArrowBigUp
              className={cn("h-4 w-4", userVote === "up" && "fill-current")}
            />
          </Button>
          {voteScore !== 0 && (
            <Span
              className={cn(
                "text-xs font-medium min-w-6 text-center",
                voteScore > 0 && "text-primary",
                voteScore < 0 && "text-destructive",
              )}
            >
              {voteScore > 0 ? `+${voteScore}` : voteScore}
            </Span>
          )}
          <Button
            variant="ghost"
            size="unset"
            onClick={() =>
              onVoteMessage(message.id, userVote === "down" ? 0 : -1)
            }
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded hover:bg-destructive/10 transition-all",
              userVote === "down"
                ? "text-destructive"
                : "text-muted-foreground hover:text-destructive",
            )}
            title={t("widget.threadedView.actions.downvote")}
          >
            <ArrowBigDown
              className={cn("h-4 w-4", userVote === "down" && "fill-current")}
            />
          </Button>
        </Div>
      )}

      {/* TTS Play/Stop button - For assistant messages */}
      {message.role === "assistant" && (
        <Button
          variant="ghost"
          size="unset"
          onClick={
            isTTSLoading
              ? cancelLoading
              : isPlaying
                ? stopAudio
                : (): void => void playAudio()
          }
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded transition-all",
            isTTSLoading
              ? "bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 hover:text-orange-300"
              : isPlaying
                ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary/80"
                : "text-muted-foreground hover:bg-primary/10 hover:text-primary",
          )}
          title={
            isTTSLoading
              ? totalChunks > 1
                ? `${t("widget.threadedView.actions.cancelLoading")} (${currentChunk}/${totalChunks})`
                : t("widget.threadedView.actions.cancelLoading")
              : isPlaying
                ? totalChunks > 1
                  ? `${t("widget.threadedView.actions.stopAudio")} (${currentChunk}/${totalChunks})`
                  : t("widget.threadedView.actions.stopAudio")
                : t("widget.threadedView.actions.playAudio", {
                    cost: ttsCreditCost.toFixed(2),
                  })
          }
        >
          {isTTSLoading ? (
            <X className="h-3.5 w-3.5" />
          ) : isPlaying ? (
            <Square className="h-3.5 w-3.5" />
          ) : (
            <Volume2 className="h-3.5 w-3.5" />
          )}
          <Span>
            {isTTSLoading
              ? totalChunks > 1
                ? `${t("widget.threadedView.actions.cancel")} (${currentChunk}/${totalChunks})`
                : t("widget.threadedView.actions.cancel")
              : isPlaying
                ? totalChunks > 1
                  ? `${t("widget.threadedView.actions.stop")} (${currentChunk}/${totalChunks})`
                  : t("widget.threadedView.actions.stop")
                : t("widget.threadedView.actions.play")}
          </Span>
        </Button>
      )}

      {/* Reply - sends a user message as child, then AI responds */}
      <Button
        variant="ghost"
        size="unset"
        onClick={(): void => startReply(message.id)}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
        title={t("widget.threadedView.actions.replyToMessage")}
      >
        <MessageSquare className="h-3.5 w-3.5" />
        <Span>{t("widget.threadedView.actions.reply")}</Span>
      </Button>

      {/* Branch - For user messages: creates sibling with edited content */}
      {message.role === "user" && (
        <Button
          variant="ghost"
          size="unset"
          onClick={(): void => startEdit(message.id)}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-success/10 text-muted-foreground hover:text-success transition-all"
          title={t("widget.threadedView.actions.branchMessage")}
        >
          <GitBranch className="h-3.5 w-3.5" />
          <Span>{t("widget.threadedView.actions.branch")}</Span>
        </Button>
      )}

      {/* Retry - For user messages: creates sibling with same content, different model */}
      {message.role === "user" && (
        <Button
          variant="ghost"
          size="unset"
          onClick={(): void => {
            onStartRetry(message);
          }}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-warning/10 text-muted-foreground hover:text-warning transition-all"
          title={t("widget.threadedView.actions.retryWithDifferent")}
        >
          <Span>{t("widget.threadedView.actions.retry")}</Span>
        </Button>
      )}

      {/* Answer as AI - For both user and assistant messages */}
      <Button
        variant="ghost"
        size="unset"
        onClick={(): void => startAnswer(message.id)}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-purple-500/10 text-muted-foreground hover:text-purple-400 transition-all"
        title={t("widget.threadedView.actions.generateAIResponse")}
      >
        <Span>{t("widget.threadedView.actions.answerAsAI")}</Span>
      </Button>

      {/* Share/Permalink */}
      <Button
        variant="ghost"
        size="unset"
        onClick={(): void => {
          const element = document.getElementById(`thread-msg-${message.id}`);
          element?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          void navigator.clipboard.writeText(
            `${window.location.href}#thread-msg-${message.id}`,
          );
        }}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
        title={t("widget.threadedView.actions.copyPermalink")}
      >
        <Share2 className="h-3.5 w-3.5" />
        <Span>{t("widget.threadedView.actions.share")}</Span>
      </Button>

      {/* Delete */}
      <Button
        variant="ghost"
        size="unset"
        onClick={handleDelete}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
        title={t("widget.threadedView.actions.deleteMessage")}
      >
        <Span>{t("widget.threadedView.actions.delete")}</Span>
      </Button>

      {/* Show parent (if not root) */}
      {message.parentId && (
        <Button
          variant="ghost"
          size="unset"
          onClick={(): void => {
            const element = document.getElementById(
              `thread-msg-${message.parentId}`,
            );
            element?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
        >
          <CornerDownRight className="h-3.5 w-3.5" />
          <Span>{t("widget.threadedView.actions.parent")}</Span>
        </Button>
      )}

      {/* Reply count badge - clickable to collapse */}
      {hasReplies && (
        <Button
          variant="ghost"
          size="unset"
          onClick={onToggleCollapse}
          className="ml-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all"
          title={t("widget.threadedView.collapseReplies")}
        >
          {replyCount}{" "}
          {replyCount === 1
            ? t("widget.threadedView.reply")
            : t("widget.threadedView.replies")}
        </Button>
      )}
    </Div>
  );
}
