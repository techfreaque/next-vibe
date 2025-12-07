"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import {
  ArrowBigDown,
  ArrowBigUp,
  CornerDownRight,
  MessageSquare,
  Share2,
  Square,
  Volume2,
  X,
} from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { ChatMessage } from "@/app/api/[locale]/agent/chat/db";
import type { useMessageActions } from "../hooks/use-message-actions";
import { FEATURE_COSTS } from "@/app/api/[locale]/products/repository-client";

interface ThreadedMessageActionsProps {
  message: ChatMessage;
  locale: CountryLanguage;
  logger: EndpointLogger;
  messageActions: ReturnType<typeof useMessageActions>;
  isTouch: boolean;
  currentUserId?: string;
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
  logger: _logger,
  messageActions,
  isTouch,
  currentUserId: _currentUserId,
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
  const { t } = simpleT(locale);

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
          : "opacity-0 group-hover/message:opacity-100 focus-within:opacity-100",
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
            title={t("app.chat.threadedView.actions.upvote")}
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
            title={t("app.chat.threadedView.actions.downvote")}
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
                ? `${t("app.chat.threadedView.actions.cancelLoading")} (${currentChunk}/${totalChunks})`
                : t("app.chat.threadedView.actions.cancelLoading")
              : isPlaying
                ? totalChunks > 1
                  ? `${t("app.chat.threadedView.actions.stopAudio")} (${currentChunk}/${totalChunks})`
                  : t("app.chat.threadedView.actions.stopAudio")
                : t("app.chat.threadedView.actions.playAudio", {
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
                ? `${t("app.chat.threadedView.actions.cancel")} (${currentChunk}/${totalChunks})`
                : t("app.chat.threadedView.actions.cancel")
              : isPlaying
                ? totalChunks > 1
                  ? `${t("app.chat.threadedView.actions.stop")} (${currentChunk}/${totalChunks})`
                  : t("app.chat.threadedView.actions.stop")
                : t("app.chat.threadedView.actions.play")}
          </Span>
        </Button>
      )}

      {/* Reply button - Creates a branch from this message */}
      <Button
        variant="ghost"
        size="unset"
        onClick={(): void => messageActions.startEdit(message.id)}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-all"
        title={t("app.chat.threadedView.actions.replyToMessage")}
      >
        <MessageSquare className="h-3.5 w-3.5" />
        <Span>{t("app.chat.threadedView.actions.reply")}</Span>
      </Button>

      {/* Edit - For user messages */}
      {message.role === "user" && (
        <Button
          variant="ghost"
          size="unset"
          onClick={(): void => messageActions.startEdit(message.id)}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-green-500/10 text-muted-foreground hover:text-green-400 transition-all"
          title={t("app.chat.threadedView.actions.editMessage")}
        >
          <Span>{t("app.chat.threadedView.actions.edit")}</Span>
        </Button>
      )}

      {/* Retry - For user messages */}
      {message.role === "user" && (
        <Button
          variant="ghost"
          size="unset"
          onClick={(): void => messageActions.startRetry(message.id)}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-yellow-500/10 text-muted-foreground hover:text-yellow-400 transition-all"
          title={t("app.chat.threadedView.actions.retryWithDifferent")}
        >
          <Span>{t("app.chat.threadedView.actions.retry")}</Span>
        </Button>
      )}

      {/* Answer as AI - For both user and assistant messages */}
      <Button
        variant="ghost"
        size="unset"
        onClick={(): void => messageActions.startAnswer(message.id)}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-purple-500/10 text-muted-foreground hover:text-purple-400 transition-all"
        title={
          message.role === "assistant"
            ? t("app.chat.threadedView.actions.respondToAI")
            : t("app.chat.threadedView.actions.generateAIResponse")
        }
      >
        <Span>{t("app.chat.threadedView.actions.answerAsAI")}</Span>
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
        title={t("app.chat.threadedView.actions.copyPermalink")}
      >
        <Share2 className="h-3.5 w-3.5" />
        <Span>{t("app.chat.threadedView.actions.share")}</Span>
      </Button>

      {/* Delete */}
      {onDeleteMessage && (
        <Button
          variant="ghost"
          size="unset"
          onClick={(): void => onDeleteMessage(message.id)}
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all"
          title={t("app.chat.threadedView.actions.deleteMessage")}
        >
          <Span>{t("app.chat.threadedView.actions.delete")}</Span>
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
          <Span>{t("app.chat.threadedView.actions.parent")}</Span>
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
