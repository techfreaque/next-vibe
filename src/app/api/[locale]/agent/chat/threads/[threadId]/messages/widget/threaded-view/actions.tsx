"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowBigDown } from "next-vibe-ui/ui/icons/ArrowBigDown";
import { ArrowBigUp } from "next-vibe-ui/ui/icons/ArrowBigUp";
import { CornerDownRight } from "next-vibe-ui/ui/icons/CornerDownRight";
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
import type { CountryLanguage } from "@/i18n/core/config";

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
  // Message actions
  onDeleteMessage?: (messageId: string) => void;
  // Reply count
  replyCount: number;
  hasReplies: boolean;
  // State flags
  isEditing: boolean;
  isRetrying: boolean;
  isAnswering: boolean;
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
  onDeleteMessage,
  replyCount,
  hasReplies,
  isEditing,
  isRetrying,
  isAnswering,
}: ThreadedMessageActionsProps): JSX.Element | null {
  const { t } = scopedTranslation.scopedT(locale);
  const { groupHover } = useMessageGroupName();

  // Editor actions from Zustand store
  const startEdit = useMessageEditorStore((s) => s.startEdit);
  const startAnswer = useMessageEditorStore((s) => s.startAnswer);

  // Calculate TTS credit cost based on text length
  const ttsCreditCost = ttsText.length * FEATURE_COSTS.TTS;

  // Don't show actions if in edit/retry/answer mode
  if (isEditing || isRetrying || isAnswering) {
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
              "flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-500/10 transition-all",
              userVote === "up"
                ? "text-blue-400"
                : "text-muted-foreground hover:text-blue-400",
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
                voteScore > 0 && "text-blue-400",
                voteScore < 0 && "text-red-400",
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
              "flex items-center gap-1 px-2 py-1 rounded hover:bg-red-500/10 transition-all",
              userVote === "down"
                ? "text-red-400"
                : "text-muted-foreground hover:text-red-400",
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
                ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                : "text-muted-foreground hover:bg-blue-500/10 hover:text-blue-400",
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

      {/* Reply button - Creates a branch from this message */}
      <Button
        variant="ghost"
        size="unset"
        onClick={(): void => startEdit(message.id)}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-all"
        title={t("widget.threadedView.actions.replyToMessage")}
      >
        <MessageSquare className="h-3.5 w-3.5" />
        <Span>{t("widget.threadedView.actions.reply")}</Span>
      </Button>

      {/* Edit - For user messages */}
      {message.role === "user" && (
        <Button
          variant="ghost"
          size="unset"
          onClick={(): void => startEdit(message.id)}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-green-500/10 text-muted-foreground hover:text-green-400 transition-all"
          title={t("widget.threadedView.actions.editMessage")}
        >
          <Span>{t("widget.threadedView.actions.edit")}</Span>
        </Button>
      )}

      {/* Retry - For user messages */}
      {message.role === "user" && (
        <Button
          variant="ghost"
          size="unset"
          onClick={(): void => {
            onStartRetry(message);
          }}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-yellow-500/10 text-muted-foreground hover:text-yellow-400 transition-all"
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
        title={
          message.role === "assistant"
            ? t("widget.threadedView.actions.respondToAI")
            : t("widget.threadedView.actions.generateAIResponse")
        }
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
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-all"
        title={t("widget.threadedView.actions.copyPermalink")}
      >
        <Share2 className="h-3.5 w-3.5" />
        <Span>{t("widget.threadedView.actions.share")}</Span>
      </Button>

      {/* Delete */}
      {onDeleteMessage && (
        <Button
          variant="ghost"
          size="unset"
          onClick={(): void => onDeleteMessage(message.id)}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
          title={t("widget.threadedView.actions.deleteMessage")}
        >
          <Span>{t("widget.threadedView.actions.delete")}</Span>
        </Button>
      )}

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
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-all"
        >
          <CornerDownRight className="h-3.5 w-3.5" />
          <Span>{t("widget.threadedView.actions.parent")}</Span>
        </Button>
      )}

      {/* Reply count badge */}
      {hasReplies && (
        <Div className="ml-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold">
          {replyCount} {replyCount === 1 ? "reply" : "replies"}
        </Div>
      )}
    </Div>
  );
}
