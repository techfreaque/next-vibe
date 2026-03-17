"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowBigDown } from "next-vibe-ui/ui/icons/ArrowBigDown";
import { ArrowBigUp } from "next-vibe-ui/ui/icons/ArrowBigUp";
import { Bot } from "next-vibe-ui/ui/icons/Bot";
import { Square } from "next-vibe-ui/ui/icons/Square";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Volume2 } from "next-vibe-ui/ui/icons/Volume2";
import { X } from "next-vibe-ui/ui/icons/X";
import { Span } from "next-vibe-ui/ui/span";
import type React from "react";

import {
  prepareTextForTTS,
  stripThinkTags,
} from "@/app/api/[locale]/agent/text-to-speech/content-processing";
import { useTTSAudio } from "@/app/api/[locale]/agent/text-to-speech/hooks";
import type { TtsVoice } from "@/app/api/[locale]/agent/text-to-speech/enum";
import { FEATURE_COSTS } from "@/app/api/[locale]/products/repository-client";
import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useWidgetNavigation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTouchDevice } from "@/hooks/use-touch-device";
import type { CountryLanguage } from "@/i18n/core/config";

import { useMessageItem } from "../hooks/use-message-item";
import { scopedTranslation } from "../i18n";
import { CopyButton } from "./copy-button";
import { useMessageGroupName } from "./embedded-context";
import { MessageActionButton } from "./message-action-button";

interface AssistantMessageActionsProps {
  messageId: string;
  content: string;
  contentMarkdown: string;
  contentText: string;
  locale: CountryLanguage;
  threadId: string;
  rootFolderId: DefaultFolderId | null;
  onAnswerAsModel: ((messageId: string) => void) | null;
  className: string | null;
  logger: EndpointLogger;
  promptTokens: number | null;
  completionTokens: number | null;
  cachedInputTokens: number | null;
  cacheWriteTokens: number | null;
  timeToFirstToken: number | null;
  creditCost: number | null;
  /** Hide TTS and interactive buttons. Used for read-only demos. */
  readOnly: boolean;
  /** User for TTS */
  user: JwtPayloadType;
  /** TTS autoplay setting */
  ttsAutoplay: boolean;
  /** TTS voice preference */
  ttsVoice: (typeof TtsVoice)[keyof typeof TtsVoice] | undefined;
  /** Credit deduction callback (null in read-only mode) */
  deductCredits: ((creditCost: number, feature: string) => void) | null;
  /** Vote callback — null when voting is not available */
  onVote: ((messageId: string, vote: 1 | -1 | 0) => Promise<void>) | null;
  userVote: "up" | "down" | null;
  voteScore: number;
}

export function AssistantMessageActions({
  messageId,
  content,
  contentMarkdown,
  contentText,
  locale,
  threadId,
  rootFolderId,
  onAnswerAsModel,
  className,
  logger,
  promptTokens,
  completionTokens,
  cachedInputTokens,
  cacheWriteTokens,
  timeToFirstToken,
  creditCost,
  readOnly,
  user,
  ttsAutoplay,
  ttsVoice,
  deductCredits,
  onVote,
  userVote,
  voteScore,
}: AssistantMessageActionsProps): React.JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const isTouch = useTouchDevice();
  const { groupHover } = useMessageGroupName();
  const { push: navigate } = useWidgetNavigation();

  const handleDelete = (): void => {
    void (async (): Promise<void> => {
      const messageIdDefs =
        await import("@/app/api/[locale]/agent/chat/threads/[threadId]/messages/[messageId]/definition");
      navigate(messageIdDefs.default.DELETE, {
        urlPathParams: { threadId, messageId },
        data: rootFolderId ? { rootFolderId } : undefined,
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  // Check if this message is currently streaming via per-item cache (O(1) per delta)
  const liveMessage = useMessageItem(messageId);
  const isMessageStreaming = liveMessage?.metadata?.isStreaming ?? false;

  // Prepare content for TTS (strip think tags, markdown, convert line breaks)
  const ttsText = prepareTextForTTS(stripThinkTags(content));

  const {
    isLoading,
    isPlaying,
    playAudio,
    stopAudio,
    cancelLoading,
    currentChunk,
    totalChunks,
  } = useTTSAudio({
    text: ttsText,
    enabled: ttsAutoplay,
    isStreaming: isMessageStreaming,
    voice: ttsVoice,
    locale,
    user,
    logger,
    messageId,
    deductCredits:
      deductCredits ??
      ((): void => {
        /* no-op in read-only mode */
      }),
  });

  // Calculate TTS credit cost based on text length
  const ttsCreditCost = ttsText.length * FEATURE_COSTS.TTS;

  return (
    <Div
      className={cn(
        "flex items-center gap-1",
        "transition-opacity duration-150",
        // Touch devices: always visible but slightly transparent
        // Pointer devices: hidden until hover
        isTouch
          ? "opacity-70 active:opacity-100"
          : `opacity-0 ${groupHover} focus-within:opacity-100`,
        className,
      )}
    >
      {/* Voting buttons */}
      {onVote && (
        <Div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="unset"
            onClick={() => onVote(messageId, userVote === "up" ? 0 : 1)}
            className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-blue-500/10 transition-all",
              userVote === "up"
                ? "text-blue-400"
                : "text-muted-foreground hover:text-blue-400",
            )}
            title={t("widget.common.assistantMessageActions.upvote")}
            disabled={readOnly}
          >
            <ArrowBigUp
              className={cn("h-3.5 w-3.5", userVote === "up" && "fill-current")}
            />
          </Button>
          {voteScore !== 0 && (
            <Span
              className={cn(
                "text-xs font-medium min-w-5 text-center",
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
            onClick={() => onVote(messageId, userVote === "down" ? 0 : -1)}
            className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-red-500/10 transition-all",
              userVote === "down"
                ? "text-red-400"
                : "text-muted-foreground hover:text-red-400",
            )}
            title={t("widget.common.assistantMessageActions.downvote")}
            disabled={readOnly}
          >
            <ArrowBigDown
              className={cn(
                "h-3.5 w-3.5",
                userVote === "down" && "fill-current",
              )}
            />
          </Button>
        </Div>
      )}

      <CopyButton
        content={content}
        contentMarkdown={contentMarkdown}
        contentText={contentText}
        locale={locale}
        logger={logger}
      />

      {/* TTS Play/Stop/Cancel Button */}
      <MessageActionButton
        icon={isLoading ? X : isPlaying ? Square : Volume2}
        onClick={
          isLoading
            ? cancelLoading
            : isPlaying
              ? stopAudio
              : (): void => {
                  void playAudio();
                }
        }
        title={
          isLoading
            ? totalChunks > 1
              ? `${t("widget.common.assistantMessageActions.cancelLoading")} (${currentChunk}/${totalChunks})`
              : t("widget.common.assistantMessageActions.cancelLoading")
            : isPlaying
              ? totalChunks > 1
                ? `${t("widget.common.assistantMessageActions.stopAudio")} (${currentChunk}/${totalChunks})`
                : t("widget.common.assistantMessageActions.stopAudio")
              : t("widget.common.assistantMessageActions.playAudio", {
                  cost: ttsCreditCost.toFixed(2),
                })
        }
        className={cn(
          isLoading && "text-orange-400 hover:text-orange-300",
          isPlaying && "text-blue-400 hover:text-blue-300",
        )}
        disabled={readOnly}
      />

      {onAnswerAsModel && (
        <MessageActionButton
          icon={Bot}
          onClick={() => onAnswerAsModel(messageId)}
          title={t("widget.common.assistantMessageActions.answerAsAI")}
          disabled={readOnly}
        />
      )}

      {!readOnly && (
        <MessageActionButton
          icon={Trash2}
          onClick={handleDelete}
          title={t("widget.common.assistantMessageActions.deleteMessage")}
          variant="destructive"
        />
      )}

      {/* Show actual cost/tokens if available - right-aligned */}
      {((creditCost !== null && creditCost !== undefined) ||
        (promptTokens !== null && promptTokens !== undefined) ||
        (completionTokens !== null && completionTokens !== undefined)) && (
        <Div className="text-xs text-muted-foreground ml-auto flex items-center gap-1.5">
          {creditCost !== null && creditCost !== undefined && (
            <Span
              title={t("widget.common.assistantMessageActions.actualCostUsed")}
            >
              {creditCost.toFixed(2)}{" "}
              {t("widget.common.assistantMessageActions.credits")}
            </Span>
          )}
          {(promptTokens !== null || completionTokens !== null) && (
            <Span
              title={`${t("widget.common.assistantMessageActions.inputTokens")}: ${(promptTokens ?? 0).toLocaleString()} | ${t("widget.common.assistantMessageActions.outputTokens")}: ${(completionTokens ?? 0).toLocaleString()}${cachedInputTokens ? ` | ${t("widget.common.assistantMessageActions.cachedTokens")}: ${cachedInputTokens.toLocaleString()}` : ""}${cacheWriteTokens ? ` | ${t("widget.common.assistantMessageActions.cacheWriteTokens")}: ${cacheWriteTokens.toLocaleString()}` : ""}`}
              className="text-muted-foreground/70"
            >
              •{" "}
              {(
                (promptTokens ?? 0) +
                (completionTokens ?? 0) +
                (cacheWriteTokens ?? 0)
              ).toLocaleString()}{" "}
              {t("widget.common.assistantMessageActions.tokens")}
            </Span>
          )}
          {cachedInputTokens !== null &&
            cachedInputTokens !== undefined &&
            cachedInputTokens > 0 &&
            promptTokens !== null &&
            promptTokens > 0 &&
            cachedInputTokens <= promptTokens && (
              <Span
                title={t(
                  "widget.common.assistantMessageActions.cachedPercentTitle",
                  {
                    percent: Math.round(
                      (cachedInputTokens / promptTokens) * 100,
                    ),
                  },
                )}
                className="text-emerald-500/70"
              >
                •{" "}
                {t("widget.common.assistantMessageActions.cachedPercent", {
                  percent: Math.round((cachedInputTokens / promptTokens) * 100),
                })}
              </Span>
            )}
          {cacheWriteTokens !== null &&
            cacheWriteTokens !== undefined &&
            cacheWriteTokens > 0 && (
              <Span
                title={t(
                  "widget.common.assistantMessageActions.cacheWriteTitle",
                  {
                    tokens: cacheWriteTokens.toLocaleString(),
                  },
                )}
                className="text-sky-500/70"
              >
                •{" "}
                {t("widget.common.assistantMessageActions.cacheWrite", {
                  tokens: cacheWriteTokens.toLocaleString(),
                })}
              </Span>
            )}
          {timeToFirstToken !== null && timeToFirstToken !== undefined && (
            <Span
              title={t(
                "widget.common.assistantMessageActions.timeToFirstTokenTitle",
              )}
              className="text-muted-foreground/70"
            >
              •{" "}
              {t("widget.common.assistantMessageActions.timeToFirstToken", {
                seconds: (timeToFirstToken / 1000).toFixed(1),
              })}
            </Span>
          )}
        </Div>
      )}
    </Div>
  );
}
