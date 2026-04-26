"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ArrowBigDown } from "next-vibe-ui/ui/icons/ArrowBigDown";
import { ArrowBigUp } from "next-vibe-ui/ui/icons/ArrowBigUp";
import { Bot } from "next-vibe-ui/ui/icons/Bot";
import { Square } from "next-vibe-ui/ui/icons/Square";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { Volume2 } from "next-vibe-ui/ui/icons/Volume2";
import { X } from "next-vibe-ui/ui/icons/X";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { Span } from "next-vibe-ui/ui/span";
import { cn } from "next-vibe/shared/utils";
import React, { useState } from "react";

import type { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import {
  prepareTextForTTS,
  stripThinkTags,
} from "@/app/api/[locale]/agent/text-to-speech/content-processing";
import { useTTSAudio } from "@/app/api/[locale]/agent/text-to-speech/hooks";
import type { TtsModelId } from "@/app/api/[locale]/agent/text-to-speech/models";
import { FEATURE_COSTS } from "@/app/api/[locale]/products/repository-client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { useWidgetNavigation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { useTouchDevice } from "next-vibe-ui/hooks/use-touch-device";
import type { CountryLanguage } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";
import type messagesDefinition from "../definition";
import { useWidgetItem } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
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
  streamingTime: number | null;
  creditCost: number | null;
  /** Hide TTS and interactive buttons. Used for read-only demos. */
  readOnly: boolean;
  /** User for TTS */
  user: JwtPayloadType;
  /** TTS autoplay setting */
  ttsAutoplay: boolean;
  /** TTS voice preference */
  voiceId: TtsModelId | undefined;
  /** Vote callback - null when voting is not available */
  onVote: ((messageId: string, vote: 1 | -1 | 0) => Promise<void>) | null;
  userVote: "up" | "down" | null;
  voteScore: number;
  /** Gap-fill variants (e.g. transcription, image description) stored on the message */
  variants?: Array<{ modality: string; content: string }> | null;
  /** The input modality of the original user message (audio, image, etc.) */
  inputModality?: string | null;
  /** Pipeline steps for assembled modality pipelines (e.g. stt → tts) */
  pipelineSteps?: Array<{
    type: string;
    modelId: string;
    creditCost: number;
    durationMs?: number;
  }> | null;
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
  streamingTime,
  creditCost,
  readOnly,
  user,
  ttsAutoplay,
  voiceId,
  onVote,
  userVote,
  voteScore,
  pipelineSteps,
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

  // Check if this message is currently streaming
  const liveMessage = useWidgetItem<typeof messagesDefinition.GET>()(
    (d) => d?.messages ?? [],
    (m) => m.id,
    messageId,
  );
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
    voiceId,
    locale,
    user,
    logger,
    messageId,
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
              "flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-primary/10 transition-all",
              userVote === "up"
                ? "text-primary"
                : "text-muted-foreground hover:text-primary",
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
            onClick={() => onVote(messageId, userVote === "down" ? 0 : -1)}
            className={cn(
              "flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-destructive/10 transition-all",
              userVote === "down"
                ? "text-destructive"
                : "text-muted-foreground hover:text-destructive",
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
          isPlaying && "text-primary hover:text-primary/80",
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

      {/* Stats - right-aligned: credits + tokens inline, details in hover popovers */}
      {((creditCost !== null && creditCost !== undefined) ||
        (promptTokens !== null && promptTokens !== undefined) ||
        (completionTokens !== null && completionTokens !== undefined)) && (
        <StatsBar
          creditCost={creditCost ?? null}
          promptTokens={promptTokens ?? null}
          completionTokens={completionTokens ?? null}
          cachedInputTokens={cachedInputTokens ?? null}
          cacheWriteTokens={cacheWriteTokens ?? null}
          timeToFirstToken={timeToFirstToken}
          streamingTime={streamingTime}
          pipelineSteps={pipelineSteps}
          t={t}
        />
      )}
    </Div>
  );
}

function StatsBar({
  creditCost,
  promptTokens,
  completionTokens,
  cachedInputTokens,
  cacheWriteTokens,
  timeToFirstToken,
  streamingTime,
  pipelineSteps,
  t,
}: {
  creditCost: number | null;
  promptTokens: number | null;
  completionTokens: number | null;
  cachedInputTokens: number | null;
  cacheWriteTokens: number | null;
  timeToFirstToken: number | null;
  streamingTime: number | null;
  pipelineSteps?: Array<{
    type: string;
    modelId: string;
    creditCost: number;
    durationMs?: number;
  }> | null;
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
}): React.JSX.Element {
  const [tokensOpen, setTokensOpen] = useState(false);
  const [timingOpen, setTimingOpen] = useState(false);

  const cachedPercent =
    cachedInputTokens && promptTokens && cachedInputTokens <= promptTokens
      ? Math.round((cachedInputTokens / promptTokens) * 100)
      : null;

  const hasTimingData = timeToFirstToken !== null || streamingTime !== null;

  return (
    <Div className="text-xs text-muted-foreground ml-auto flex items-center gap-1.5">
      {creditCost !== null && (
        <Span>
          {creditCost.toFixed(2)}{" "}
          {t("widget.common.assistantMessageActions.credits")}
        </Span>
      )}

      {(promptTokens !== null || completionTokens !== null) && (
        <Popover open={tokensOpen} onOpenChange={setTokensOpen}>
          <PopoverTrigger asChild>
            <Span
              className="text-muted-foreground/70 cursor-pointer hover:text-muted-foreground transition-colors"
              onMouseEnter={() => {
                setTokensOpen(true);
              }}
              onMouseLeave={() => {
                setTokensOpen(false);
              }}
            >
              •{" "}
              {((promptTokens ?? 0) + (completionTokens ?? 0)).toLocaleString()}{" "}
              {t("widget.common.assistantMessageActions.tokens")}
              {cachedPercent !== null &&
                ` · ${cachedPercent}% ${t("widget.common.assistantMessageActions.cached")}`}
            </Span>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            sideOffset={6}
            className="w-auto min-w-40 p-0 text-xs"
            onOpenAutoFocus={(e) => {
              e.preventDefault();
            }}
          >
            <Div
              className="flex flex-col gap-1.5 p-3"
              onMouseEnter={() => {
                setTokensOpen(true);
              }}
              onMouseLeave={() => {
                setTokensOpen(false);
              }}
            >
              <Div className="flex justify-between gap-4">
                <Span className="text-muted-foreground">
                  {t("widget.common.assistantMessageActions.inputTokens")}
                </Span>
                <Span className="font-mono tabular-nums">
                  {(promptTokens ?? 0).toLocaleString()}
                </Span>
              </Div>
              <Div className="flex justify-between gap-4">
                <Span className="text-muted-foreground">
                  {t("widget.common.assistantMessageActions.outputTokens")}
                </Span>
                <Span className="font-mono tabular-nums">
                  {(completionTokens ?? 0).toLocaleString()}
                </Span>
              </Div>
              {cachedInputTokens !== null && cachedInputTokens > 0 && (
                <Div className="flex justify-between gap-4">
                  <Span className="text-emerald-500/80">
                    {t("widget.common.assistantMessageActions.cachedTokens")}
                  </Span>
                  <Span className="font-mono tabular-nums text-emerald-500/80">
                    {cachedInputTokens.toLocaleString()}
                    {cachedPercent !== null && ` (${cachedPercent}%)`}
                  </Span>
                </Div>
              )}
              {cacheWriteTokens !== null && cacheWriteTokens > 0 && (
                <Div className="flex justify-between gap-4">
                  <Span className="text-sky-500/80">
                    {t(
                      "widget.common.assistantMessageActions.cacheWriteTokens",
                    )}
                  </Span>
                  <Span className="font-mono tabular-nums text-sky-500/80">
                    {cacheWriteTokens.toLocaleString()}
                  </Span>
                </Div>
              )}
            </Div>
          </PopoverContent>
        </Popover>
      )}

      {hasTimingData && (
        <Popover open={timingOpen} onOpenChange={setTimingOpen}>
          <PopoverTrigger asChild>
            <Span
              className="text-muted-foreground/70 cursor-pointer hover:text-muted-foreground transition-colors"
              onMouseEnter={() => {
                setTimingOpen(true);
              }}
              onMouseLeave={() => {
                setTimingOpen(false);
              }}
            >
              •{" "}
              {timeToFirstToken !== null
                ? t("widget.common.assistantMessageActions.timeToFirstToken", {
                    seconds: (timeToFirstToken / 1000).toFixed(1),
                  })
                : t("widget.common.assistantMessageActions.streamingTime", {
                    seconds: ((streamingTime ?? 0) / 1000).toFixed(1),
                  })}
            </Span>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            sideOffset={6}
            className="w-auto min-w-40 p-0 text-xs"
            onOpenAutoFocus={(e) => {
              e.preventDefault();
            }}
          >
            <Div
              className="flex flex-col gap-1.5 p-3"
              onMouseEnter={() => {
                setTimingOpen(true);
              }}
              onMouseLeave={() => {
                setTimingOpen(false);
              }}
            >
              {timeToFirstToken !== null && (
                <Div className="flex justify-between gap-4">
                  <Span className="text-muted-foreground">
                    {t(
                      "widget.common.assistantMessageActions.timeToFirstTokenTitle",
                    )}
                  </Span>
                  <Span className="font-mono tabular-nums">
                    {(timeToFirstToken / 1000).toFixed(2)}s
                  </Span>
                </Div>
              )}
              {streamingTime !== null && (
                <Div className="flex justify-between gap-4">
                  <Span className="text-muted-foreground">
                    {t(
                      "widget.common.assistantMessageActions.streamingTimeTitle",
                    )}
                  </Span>
                  <Span className="font-mono tabular-nums">
                    {(streamingTime / 1000).toFixed(2)}s
                  </Span>
                </Div>
              )}
              {pipelineSteps && pipelineSteps.length > 0 && (
                <Div className="flex justify-between gap-4 pt-1 border-t border-border/50">
                  <Span className="text-muted-foreground">
                    {t("widget.common.assistantMessageActions.pipeline")}
                  </Span>
                  <Span className="text-right">
                    {pipelineSteps.map((s) => s.type).join(" → ")}
                  </Span>
                </Div>
              )}
            </Div>
          </PopoverContent>
        </Popover>
      )}

      {pipelineSteps && pipelineSteps.length > 0 && !hasTimingData && (
        <Span className="text-muted-foreground/70 before:content-['·'] before:mr-1">
          {pipelineSteps.map((s) => s.type).join(" → ")}
        </Span>
      )}
    </Div>
  );
}
